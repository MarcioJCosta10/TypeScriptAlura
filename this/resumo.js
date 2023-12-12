//#Analogia
///Pessoa
///Marcio comprou um carro, ele está muito feliz!
//>>>THIS - DELE - DELA, ELE, ELA

var ninja = {
    nome: "Marcio",
    atacar:function(){
        console.log(`${ninja.nome} arremesou sua espada!`)
        console.log(`${this.nome} arremesou sua espada!`)
    }
}
ninja.atacar()

//Podemos usar métodos de outro objeto

let menina = {
    nome: "Cristina!",
    falar: function(){
        console.log('Olá meu nome é' + ' ' + this.nome )
    }
}
menina.falar();

///Ao Atribuir um metodo de um objeto a uma variavel, o THIS passa a se referir
//ao dono da variavel que é quem invoca o metodo e não ao objeto que inicialmente
//definiu o metodo.

let nome = "Teste"
let dizer = menina.falar //#Aqui o this passa a se referir a variável dizer
dizer()

//Podemos mudar o contexto de uma função e assoiciar o this a outro objeto:
//usando metodo call().

dizer.call(menina)

///Podemos pedir empretado o metodo de outro objeto:
var carro = {
    numero: 400,
    mostrarNumero: function(){
        console.log(this.numero);
    }
}
carro.mostrarNumero()

var moto = {
    numero:100
}

carro.mostrarNumero.call(moto)