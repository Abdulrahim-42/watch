import {createSlice} from "@reduxjs/toolkit"


const initialState = {
    user:null, // {}
    isAuthenticated:false
}


const storedAuthStatus = localStorage.getItem("isAuthenticated") //true false
const storedUser = localStorage.getItem("user")


//header payload signuture jwt tokenin 
//true
if(storedAuthStatus) {
    // true
    initialState.isAuthenticated = JSON.parse(storedAuthStatus)
}

//name, token, email

if(storedUser) {
    initialState.user = JSON.parse(storedUser)
}


export const userSlice = createSlice({
    name:"userSlice",
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload
            localStorage.setItem("user", JSON.stringify(action.payload))
        },
        setIsAuthenticated(state, action) {
            state.isAuthenticated = action.payload
            localStorage.setItem("isAuthenticated", JSON.stringify(action.payload))
        },

        //cache rtk cache ustunlukleri
        logout(state) {
            state.user = null
            state.isAuthenticated = false
            localStorage.removeItem("isAuthenticated")
            localStorage.removeItem("user")
        }
    }
})

export default userSlice.reducer
export const {setUser, setIsAuthenticated, logout} = userSlice.actions