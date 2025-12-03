class Telebe {
    constructor(ad , soyad , yas) {
        this.name = ad 
        this.surname = soyad 
        this.age = yas
    } 

    // {
    //     name:"Asim"
    //     surname:"Layicov"
    // } constructor yaradir 

    tevelluduHesabla() {
    return new Date().getFullYear() - this.age
    // Complementary Metal-Oxide-Semiconductor CMOS
    }  //Burda tevelluduHesabla metoddur 
}

const numunePrint = {
    name:"Asim" ,
    surname:"Layicov" ,
    age:"21"
}

// Telebe instancelar (numune)

const telebe1 = new Telebe("Asim" , "Layicov" , 21)

console.log(telebe1.tevelluduHesabla())