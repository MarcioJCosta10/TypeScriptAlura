//#1 - VINCULAÇÃO PADRÃO:
//Quando chamamos sem objetos na frente a vinculação será window ou global:

function mostrar(){

    console.log(this)
}
mostrar()


//#2 - VINCULAÇÃO IMPLICITA:
//Usado quando chamamos uma funçao usando o ponto, o que está do lado esquerdo 
//do ponto é o contexto:

const menina ={

    nome:"Cristina",

    jogos:["GTA","Zelda","Pes"], 
   
    mostrarJogos(){
        console.log(this.jogos)
    }
}
menina.mostrarJogos()


//#3 - VINCULAÇÃO EXPLICITA:
//.call

const jogo = {

    nome:'GTA',

    ano:2020,
}

const carro={

    nome:'Toyota',

    ano:1984,

    mostrarNome(){
        console.log(this.nome)
    },

    trocarAno(ano){
        this.ano = ano
    }
}

carro.mostrarNome()
carro.mostrarNome.call(jogo)
carro.trocarAno(1998)
carro.trocarAno.call(jogo,2025);
console.log(carro.ano);

//.apply -->  .apply é usado para passar um array como argumento:
carro.trocarAno.apply(jogo,[2030]);
console.log(jogo);



//#4 - VINCULAÇÃO COM BIND:
//Ao inves de usar o metodo do outro objeto, cria o proprio metodo no objeto 
//atual igual ao metodo do outro objeto:

const trocarAnoDoJogo = carro.trocarAno.bind(jogo,2050)
trocarAnoDoJogo()
console.log(jogo);


//#5 - VINCULAÇÃO COM O OBEJTO QUE DISPARA O EVENTO:

const botao = document.getElementById('botao')
botao.addEventListener('click',function() {
    console.log('this')
    this.style.backgroundColor ='blue'
 })


//#6 - VINCULAÇÃO COM A NOVA INSTANCIA - CONSTRUTOR:

function Pessoa(nome){
	this.nome = nome
}

const p1 = new Pessoa("Marcio")
console.log(p1.nome)

const p2 = new Pessoa("Cristina")
console.log(p2.nome)


//#7 - VINCULAÇÃO NO CALLBACK:

const pessoa ={

    nome:"marcio",

    jogos:["GTA","Zelda","Pes"],
  
    mostrarJogos(){
        //#hack do javascript salvar o this antes da troca para window:
        let that = this
        this.jogos.forEach(function(jogo){
        //console.log(this.nome, jogo)
        console.log(that.nome, jogo)
        })
        
        ||

        //#podemos passar o objeto que referencia o this:
        this.jogos.forEach(function(jogo){
      
        console.log(this.nome, jogo)

        },this)
				
				||
        //#Ou usar arrow function
				this.jogos.forEach((jogo)=>{ 
            console.log(this.nome, jogo)
         }) 
    }
}
pessoa.mostrarJogos()