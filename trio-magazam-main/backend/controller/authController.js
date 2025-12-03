import catchAsyncErrors from "../middleware/catchAsyncErrors.js";
import User from "../model/User.js";
import { getResetPasswordTemplate } from "../utils/emailTemplates.js";
import ErrorHandler from "../utils/errorHandler.js";
import { sendEmail } from "../utils/sendEmail.js";
import sendToken from "../utils/sendToken.js";
import crypto from "crypto";


// ========================= REGISTER =========================
export const registerUser = catchAsyncErrors(async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({ name, email, password });

    sendToken(user, 201, res);
});


// ========================= LOGIN =========================
export const login = catchAsyncErrors(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler("Zəhmət olmasa email və şifrəni daxil edin", 400));
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Bu email ilə istifadəçi tapılmadı", 401));
    }

    const isPasswordMatched = await user.shifreleriMuqayiseEt(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Şifrə yanlışdır", 401));
    }

    sendToken(user, 200, res);
});


// ========================= LOGOUT =========================
export const logout = catchAsyncErrors(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        message: "Uğurla çıxış edildi",
    });
});


// ========================= FORGOT PASSWORD =========================
export const forgotPassword = catchAsyncErrors(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
        return next(new ErrorHandler("İstifadəçi tapılmadı", 404));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/crud/v1/password/reset/token/${resetToken}`;
    const message = getResetPasswordTemplate(user?.name, resetUrl);

    try {
        await sendEmail({
            email: user?.email,
            subject: "Şifrənin Sıfırlanması",
            message,
        });

        res.status(200).json({
            message: "Emailinizi yoxlayın",
        });
    } catch (err) {
        user.resetPasswordExpire = undefined;
        user.resetPasswordToken = undefined;

        await user.save();

        return next(
            new ErrorHandler("Serverdə gözlənilməyən xəta baş verdi", 500)
        );
    }
});


// ========================= RESET PASSWORD =========================
export const resetPassword = catchAsyncErrors(async (req, res, next) => {
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req?.params?.token)
        .digest("hex");

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
        return next(
            new ErrorHandler("Token yanlışdır və ya vaxtı bitmişdir", 400)
        );
    }

    if (req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler("Şifrələr eyni deyil", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    sendToken(user, 200, res);
});


// ========================= UPDATE PROFILE (NAME / EMAIL) =========================
export const updateProfile = catchAsyncErrors(async (req, res, next) => {
    const { name, email } = req.body;

    // Yeni gələn datanı toplamaq üçün obyekt
    const newUserData = {};

    if (name) {
        newUserData.name = name;
    }

    if (email) {
        // Eyni emaildən başqa user istifadə edirsə, error qaytar
        const emailCheck = await User.findOne({ email });

        if (emailCheck && emailCheck.id !== req.user.id) {
            return next(new ErrorHandler("Bu email artıq istifadə olunur", 400));
        }

        newUserData.email = email;
    }

    // İstifadəçinin mövcud olub-olmamasını yoxla
    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true,
    });

    if (!user) {
        return next(new ErrorHandler("İstifadəçi tapılmadı", 404));
    }

    // Yenilənmiş məlumatlarla yeni token yaz (cookie + response)
    sendToken(user, 200, res);
});
