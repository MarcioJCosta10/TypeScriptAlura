>>>>>> Parte1
#Iniciar um projeto 
nmp install

!!Na estrutura de pastas, a parta dist é tudo que o navegador entende.

#Setup typescript
npm install typescript@4.2.2 --save-dev
>> rename files app.js to app.ts
>> rename files negociacao.js to negociacao.ts
>> mover para a pasta app: app.ts
>> mover para a pasta app/models: egociacao.ts

!!Todo código typescript é feito na pasta app, após isso será compilado para 
javascript.

#configurar o compilador typescript
>> criar tsconfig.json na raiz do projeto
{
    "compilerOptions":{      
        "outDir": "dist/js",    #onde será salvo os arquivos após compilar em ts.          
        "target":"ES6",         #versão da linguagem javascript que será usada. 
        "noEmitOnError": true,  #Não compila se houver erro no código. 
        "noImplicitAny": true,  #não usar tipo any autocompletion.
    },
    "include":[ "app/**/*"]     #local dos arquivos que serão compilados.
}

!!Configuração do compilador, editar o package.json
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "server": "lite-server --baseDir=dist",
    "start": "concurrently \"npm run watch\" \"npm run server\"",
    "compile":"tsc"
  },

  >> npm run compile

  !!Após compilar toda correção deve ser feita no arquivo .ts

  #colocar o compilador ts em modo watch 
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "server": "lite-server --baseDir=dist",
    "start": "concurrently \"npm run watch\" \"npm run server\"",
    "compile":"tsc",
    "watch": "tsc -w"
  },

 #rodar o compilador ts e o servidor web ao mesmo tempo
 #modulo concurrently  permite ao node executar dois scripts em paralelo
 scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "server": "lite-server --baseDir=dist",
    "start": "concurrently \"npm run watch\" \"npm run server\"",
    "compile": "tsc",
    "watch":"tsc -w"
  },

#Sintaxe
"#" Antes do atributo torna ele privado, sintaxe mais nova do js. 
   #data;
   #quantidade;
   #valor;
 
definição de atributos privados
    private _data;
    private _quantidade;
    private _valor;

#controllers 
ponte da interação do usuario com a página e a criação de modelos.

 !!Sem tipagem typescript adota o tipo any implicitamente  
 !!typescript vem com tipos para manipular elementos de DOM
 HTMLInputElement 

 !!Typescript tem suporte a tipos Generics
 export class Negociacoes{
    private negociacoes: Array<Negociacao> = []
}

#ReadonlyArray 
Definir um array somente leitura

#formatação de datas usando Intl
Intl.DateTimeFormat().format(negociacao.data)

#Modificador protected:
Só a classe que criou o atributo ou método tem acesso, mas as classes 
filhas tmb podem ter acesso.

>>>>>>>Parte 2
Agora iremos criar um microframework para renderizar na tela os dados das 
negociacoes:

#Modificador protected:
Quando trabalhamos com herança e usamos o modificador protected dizemos:
Só a classe que criou tem acesso, mas as classes filhas tmb podem ter acesso.  

import {View} from "./view.js"
export class MensagemView extends View<string> {

     protected template(model: string): string {
        return`<p class="alert alert-info">${model}</p>`
    }
}

#Abstract class: 
Em uma classe abstrata não podemos criar uma instância diretamente dela, 
somente se uma classe herdar, assim posso criar uma instancia da classe filha.
Toda classe abstrata pode ter nenhum, um ou mais metodos abstratos:

#Metodos abstratos:
Metodo que a classe pai não sabe como será implementado, é responsabilidade da 
classe filha:
```js
abstract template(model: T): string 
```
#Metodos protected abstract:
Só a classe pai e as classes filhas podem ter acesso ao método.
Métodos declarados na classe pai como protected não podem ser modificados para 
private, somente podemos torar public ou manter como protected;
```js
export abstract class View <T>{
    protected elemento: HTMLElement
    private escapar: boolean = false
    constructor(seletor: string, escapar?: boolean) { 
        const elemento = document.querySelector(seletor)
        if(elemento){
            this.elemento = elemento as HTMLElement    
        }else{
            throw Error(`Seletor ${seletor} não existe no DOM. Verifique!`)
        }        
        if(escapar){
            this.escapar = escapar;
        }
    }

    public update(model: T): void {
        let template = this.template(model)
        if(this.escapar){
            template = template.replace(/<script>[\s\S]*?<\/script>/,'')
        }
        this.elemento.innerHTML = template
    }
    protected abstract template(model: T): string  
}
```
#Classe herdando:

```js
import {View} from "./view.js"

export class MensagemView extends View<string> {
     //se o metodo na classe abstrata for protected na herança tbm deve ser
     protected template(model: string): string {
        return`<p class="alert alert-info">${model}</p>`
    }
}
```
#Enumeration: 
É um namespace que definimos para que seja visível por toda aplicação
>>>enum
```js
export enum DiasDaSemana{
    DOMINGO,
    SEGUNDA,
    TERÇA,
    QUARTA,
    QUINTA,
    SEXTA,
    SABADO
}
```
!! Typescript determina enumeração de ordem para enums de forma automática, porém 
isso pode gerar problemas, o ideal é determinar os valores de ordem de cada 
elemento da enum.

#criar um metodo da classe sem a necessidade de criar uma instancia da classe:
#usaremos o modificador static que deve ser sempre public
#todo método static pode ser chamado diretamente da classe:
#Não será mais um método de instancia, mas um metodo da própria classe:
```js
				const negociacaoTemp = new Negociacao(null, 0, 0)
        const negociacao = negociacaoTemp.criaDe(
            this.inputData.value,
            this.inputQuantidade.value,
            this.inputValor.value
)

#Na classe onde foi definido o método devememos renomear para public static:
public static criaDe(dataString: string, quantidadeString: string, valorString: string): Negociacao{
        const exp = /-/g;
        const date = new Date(dataString.replace(exp, ','))
        const quantidade = parseInt(quantidadeString)
        const valor = parseFloat(valorString)
        return new Negociacao(date, quantidade, valor)

}
#após essa mundança isso será possível:
public adciona(): void {        
        const negociacao = Negociacao.criaDe(
            this.inputData.value,
            this.inputQuantidade.value,
            this.inputValor.value
				)
}
```
#proteger o template contra script injection
```js
export abstract class View <T>{

    protected elemento: HTMLElement
    private escapar: boolean = false

    constructor(seletor: string, escapar: boolean) {         
        this.elemento = document.querySelector(seletor)
    }

    public update(model: T): void {
        let template = this.template(model)
        #precisamos de uma lógica para tratar esse parametro opcional
        if(this.escapar){
            template = template.replace(/<script>[\s\S]*?<\/script>/,'')
        }
        this.elemento.innerHTML = template
    }
    protected abstract template(model: T): string
}
```
!!Agora tornaremos essa opção de escapar opcional usando o sinal de interrogação 
na frente do parametro.
```js
constructor(seletor: string, escapar?: boolean)
```
!!O parametro opcional não funciona como primeiro parametro, ele precisa ser o 
último parametro, não pode ter nenhum required antes dele.

#melhorar o ambiente e prepara para o próximo capítulo
!!Remover os comentários do código compilado
```js
{
    "compilerOptions":{        
        "outDir": "dist/js",
        "target":"ES6",
        "noEmitOnError": true,
        "noImplicitAny": true,
    >>>>"removeComments": true
    },
    "include":[ "app/**/*"]
}
```
#Ativação do strictNullChecks
O querySelector não está validando se o id do elemento existe.
O typescript sabe que querySelector pode retornar o elemento ou null, mas por 
padrão ele remove essa checagem padrão.
Adicionando a propriedade strictNullChecks o typescript irá validar que o id do 
elemento pode ser null.
```js
{
    "compilerOptions":{        
        "outDir": "dist/js",
        "target":"ES6",
        "noEmitOnError": true,
        "noImplicitAny": true,
        "removeComments": true,
        "strictNullChecks": true
    },
    "include":[ "app/**/*"]
}
```
!!Como suprimir erros, quando fizer sentido, resultantes do strictNullChecks
No código onde recebemos o erro, usamos um "casting" para determinar que seja 
convertido para um tipo que eu garanto que não dará problema:
        
this.inputData = document.querySelector('#data') as HTMLInputElement;
this.inputQuantidade = document.querySelector('#quantidade') as HTMLInputElement;
this.inputValor = document.querySelector('#valor') as HTMLInputElement;

|| 

this.inputData = <HTMLInputElement> document.querySelector('#data');
this.inputQuantidade = <HTMLInputElement> document.querySelector('#quantidade');
this.inputValor = <HTMLInputElement> document.querySelector('#valor');

>>>Parte 3

>>> nmp install
>>> npm run start

#Exemplo exibir tempo de renderização:
Poderíamosmos usar assim, cria t1 e t2 e loga a diferença:>
```js
    public update(model: T): void {
        const t1 = performance.now();
        let template = this.template(model);
        if (this.escapar) {
            template = template
                .replace(/<script>[\s\S]*?<\/script>/, '');
        }
        this.elemento.innerHTML = template;
        const t2 = performance.now();
        console.log(`Tempo de execução do método update: ${(t2-t1)/1000} segundos`)
    }

```
porém não é inteligente, o ideal é usar os @decorators

#decorators: 
!!É nada mais nada menos que uma função.
!!Antes temos que configurar o compilador para usar decorators:

```js
{
    "compilerOptions": {
        "outDir": "app/dist/js",
        "target": "ES6",
        "noEmitOnError": true,
        "noImplicitAny": true,
        "removeComments": true,
        "strictNullChecks": true,
  >>>   "experimentalDecorators": true
    },
    "include": ["app/src/**/*"]
}
```

#paramentros de um decorator:

```js
export function logarTempoDeExecucao() {
  return function (
                 //se colocar o decorator em um método estático target é a função    
    target: any, //construtora da classe.
                 //se não for metodo estático ele retorna o prototype da classe
    propertyKey: string, // dá o nome do metodo como string que foi decorado
    descriptor: PropertyDescriptor //sabe tudo sobre o método que vamos executar, 
																	 //tem referencia do método original
  ) 
  {
    return descriptor
  };
}
```
!! Detalhes de implementação do decorator
Como não sabemos a quantidade de parametros que vai chegar na função do decorator 
usamos function(...args: Array<any>): onde os parametros passados pela função 
será transformado em um array e será passado no args, será um Array<any> array 
do tipo any pois não sabemos os tipos dos parametros que serão passados:

```js
	descriptor.value = function(...args: Array<any>)
```
#passando parametro para o decorator:
!!Definiremos se devemos exibir o tempo de execução em segundos ou milisegundos :

```js
//passaremos o parametro para o decorator como boolean default false
export function logarTempoDeExecucao(emSegundos: boolean = false) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ) {
        const metodoOriginal = descriptor.value
        descriptor.value = function(...args: Array<any>){
          //definimos qual sera divisor e unidade usada de acordo com o parametro
            let divisor = 1;
            let unidade = 'milisegundos'
            if(emSegundos){
                divisor = 1000
                unidade = 'segundos'
            }
            const t1 = performance.now()
       ///chamar o metodo original
       //como perdemos a referencia do this usaremos o metodo apply para recuperar
            const retorno = metodoOriginal.apply(this, args)
            const t2 = performance.now()
            console.log(`Metodo: ${propertyKey}: Tempo de execução: ${(t2-t1)/divisor} ${unidade}.`)
            retorno
        }
        return descriptor
    }
}

//chamaremos assim
 @logarTempoDeExecucao(true)
```
!!A ordem de execução do decorator é de cima para baixo
!!Caso não seja necessário pssar parametros para o decorator, podemos 
retornar diretamente a funcion.

```js
export function inspect(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor
) {
  const metodoOriginal = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`--- Método ${propertyKey}`);
    console.log(`------ parâmetros ${JSON.stringify(args)}`);
    const retorno = metodoOriginal.apply(this, args);
    console.log(`------ retorno ${JSON.stringify(retorno)}`);
    return retorno;
  };
  return descriptor;
}
```
!! Quando retorno diretamente a function decorator, para chamá-lo não ha necessiade de wapper da funcion

```js
    @inspect
    public update(model: T): void {
        let template = this.template(model);
        if (this.escapar) {
            template = template
                .replace(/<script>[\s\S]*?<\/script>/, '');
        }
        this.elemento.innerHTML = template;
    }
```
!!O Recomendado é sempre passar o wapper

#decorator de propriedades:
O decorator de propriedade não tem a propriedade descriptor: PropertyDescriptor
Esse decorator é aplicado no momento de declaração da classe, o typescrit 
modificará a classe para aplicar esse decorator.

```js
export function domInjector(seletor: string){
  //nesse caso o target é o prototype da classe 
  //propertyKey é a propriedade que quero modificar
    return function(target: any, propertyKey: string){            
        const getter = function(){
            const elemento  = document.querySelector(seletor);                    
            return elemento
        }
        //aqui estou criando um getter
        Object.defineProperty(target, propertyKey, {get: getter})
    }
}
```

!! Agora vamos usar o elemento cacheado para evitar ficar buscando o elemento toda hora:
```js
  export function domInjector(seletor: string){
    return function(target: any, propertyKey: string){
        console.log(`Modificando prototype ${target.constructor.name} e adicionando getter para a propriedade ${propertyKey}`);        
        let elemento: HTMLElement; //aqui definimos a variavel que receberá o elemento
        const getter = function(){
            if(!elemento){

                const elemento  = <HTMLElement>document.querySelector(seletor)

                console.log(`Buscando emento do DOM com o seletor ${seletor} para  injetar em ${propertyKey}`)
            }         
            return elemento            
        }
        Object.defineProperty(target, propertyKey, {get: getter})
    }
}
```
#Rodando uma API externa
Essa aplicação vai se integrar com uma API Rest e exibiremos os dados dessa api na tela
>>>Acessar a pasta servidor-api
>>>npm install 
>>>npm start

criaremos o método botaoImporta()
Adicionaremos o addEventListener() para ficar ouvindo o button

```js
const botaoImporta = document.querySelector('#botao-importa')
if(botaoImporta){
    //Não vou trabalhar com this nem event então posso usar arrowfunctions
    botaoImporta.addEventListener('click', () =>{
        controller.importaDados()
    }) 

}else{
    throw Error('Botao importa não foi encontrado.')
}
```
!!Na implementação do método importaDados() usaremos a api fetch nativa globalmente no navegador.

```js
    public importaDados():void {
        fetch('http://localhost:8080/dados') //fetch retorna uma promisse
        .then(res =>{
            return res.json();             //como sei que é um json retornno aqui
        })
        .then((dados: any[])=>{           //aqui não sei o tipo que chega do 
	                                        //backend, só sei que é um array
            return dados.map(dadosDeHoje =>{
                return new Negociacao(
									new Date(), 
									dadosDeHoje.vezes, 
									dadosDeHoje.montante) // como sei que é um array vou criar uma 
																				//nova negociação para cada item
            })                                                                              // a data será sempre a do dia
        })
        .then(negociacoesDeHoje => {  // aqui o typescript já infere que é um 
																			// array do tipo negociação
																			// de acordo com o retorno anterior
            for(let negociacao of negociacoesDeHoje){
                this.negociacoes.adiciona(negociacao) // aqui estou adicionando 
																											// uma nova negociacao a 
																											// lista de negociacoes
            }
            this.negociacoesView.update(this.negociacoes) //aqui atualizo a view

        })
    }
```

!! Melhorar esse método para que o typescript avise caso tenha erros em tempo de desenvolvimento, vamos usar interface:

#Interfaces - Pode ser usada para definir tipo para os dados que receberei:
Usado para definir um shape, uma forma para o dado que vem do backend, quero 
tipar o dado com um tipo que vou definir

!!Interface jamais poderá ser instanciada igual a uma classe
```js
export interface NegociacoesDoDia{
    montante: number; // Se usarmos o rename symbol o typescript irá alterar em todas as ocorrências desse valor 
    vezes: number;
}

```
#Isolar a api em uma camada de serviço
criar uma pasta para essa classe e remover de controller
```js
import { NegociacoesDoDia } from "../interfaces/negociacao-do-dia.js";
import { Negociacao } from "../models/negociacao.js";

export class NegociacoesService{

    public obterNegociacoesDoDia(): Promise<Negociacao[]>{
        return fetch('http://localhost:8080/dados')
            .then(res =>{
                return res.json();
            })
            .then((dados: NegociacoesDoDia[])=>{
                return dados.map(dadosDeHoje =>{
                    return new Negociacao(
														new Date(), 
														dadosDeHoje.vezes, 
														dadosDeHoje.montante)
                })
            })
    }
}
```
!!Chega de console log
```js
        console.log(`
            Data: ${negociacao.data},
            Quantidade: ${negociacao.quantidade},
            Valor: ${negociacao.valor},
        `);
        console.log(JSON.stringify(this.negociacoes, null, 2)) //assim exibo identado
```
```js
!!Adicionar os metodos paraTexto nas classes negociacao e negociacoes
   public paraTexto(): string {
        return ` Data: ${this.data}, Quantidade: ${this.quantidade}, Valor: ${this.valor}`
    }
    
    public paraTexto(): string{
        return JSON.stringify(this.negociacoes, null, 2)//assim exibo identado
    }

```
#Polimorfismo
!! Capacidade que um objeto tem de ser referenciado de multiplas formas

!!Classe abstrata que não implementamos o construtor ele está subentendido
criaremos a classe abstrata imprimivel
```js
export abstract class imprimivel {
    constructor(){}    //aqui
    public abstract paraTexto(): string;
}
``` 
#Agora falo que a classe imprimir receberá um parametro do tipo imprimivel
onde serei obrigado a implementar o método e a classe que herdar terá que implementar o metodo paraTexto()
```js
import { Imprimivel } from "./imprimivel.js";

export function imprimir(...objetos: Imprimivel[]) { //aqui digo que aceito qq objeto que seja imprimivel
  for (let objeto of objetos) {
    console.log(objeto.paraTexto());
  }
}

```
!!Quando a classe está extendendo outra, o contrutor será sobrescrito, para 
garantir que o contrutor da classe será iniciado devemos chamar o, 
contrutor super que é da super classe

```js
export class Negociacao extends imprimivel{
    constructor(
        private _data: Date, 
        public readonly quantidade: number, 
        public readonly valor: number
    ) {
        super() //aqui
    }

```
!!Com o poliformismo posso ter 30 mil objetos no sistema, se todos herdarem e 
extender imprimivel e implementar o metodo abstrato imprimivel, o metodo 
imprimir vai rodar.

#implements
!!Sempre que temos um comportamente e queremos garantir esse comportamento em 
diversas classes e não quero usar herança, devemos usar uma interface.

!!toda interface é publica e todo metodo de uma interface é abstrato.
!!para obrigar que uma classe assine o contrato com uma interface usamos 
o implements
!!Posso implementar quantas interfaces eu quiser.

#Comparar se as negociações são iguais antes de importar:

Criar o méto ehIgual() na classe negociação
```js
    public ehIgual(negociacao: Negociacao): boolean {
        return this.data.getDate() === negociacao.data.getDate()
        && this.data.getMonth() === negociacao.data.getMonth()
        && this.data.getFullYear() === negociacao.data.getFullYear()
    }

```

No controller mudar o metodo importarDados:
```js
 public importaDados():void {
        this.negociacoesService
        .obterNegociacoesDoDia()
        .then(negociacoesDeHoje => {
            return negociacoesDeHoje.filter(negociacoesDeHoje =>{
                return !this.negociacoes
                .lista()
                //some se encontar a primeira coisa e é verdadeira ele para e 
								//retorna true
                //se não encontrar nada retorna true
                .some(negociacao => negociacao
                .ehIgual(negociacoesDeHoje))
            })
        })        
        .then(negociacoesDeHoje => { 
            for(let negociacao of negociacoesDeHoje){
                this.negociacoes.adiciona(negociacao)
            }
            this.negociacoesView.update(this.negociacoes)
        })
        
    }
```

#Interface Generics:
Criar a interface Comparavel:

```js
export interface Comparavel{
    ehIgual(objeto: any): boolean;
}
```

Agora mudaremos para Interface Generics passando o tipo <T>

```js
    export interface Comparavel<T>{
    ehIgual(objeto: T): boolean;
}
```
!!Agora estamos usando a interface para obrigar o dev a implementar o metodo é 
igual e estamos usando generics para dizer qual será o tipo
do objeto recebido como parametro na comparação.

Agora vamos evitar a necessidade de ficar repetindo essa utilização de interface 
com generics e a implementação do Imprimivel e Comparavel em todas as classes:

!!Uma classe só pode extender uma outra classe, não existe herança multipla em TS,
mas uma interface pode externder quantas interfaces quiser.

```js
import { Imprimivel } from "../utils/imprimivel.js";
import { Comparavel } from "./comparavel.js";

export interface Modelo<T> extends Imprimivel, Comparavel<T>{

}
```
Agora quem implementar a interface Modelo é obrigado a implementar o método 
Imprimivel e Comparavel.

!!Podemos usar o extends para quantas interfaces eu quiser, só não podemos fazer 
uma classe usar extends para mais de uma.

#Debugar código em TypeScript:
Alterar o tsconfig.json
```js
    {
    "compilerOptions": {
        "outDir": "app/dist/js",
        "target": "ES6",
        "noEmitOnError": true,
        "noImplicitAny": true,
        "removeComments": true,
        "strictNullChecks": true,
        "experimentalDecorators": true,
    >>> "sourceMap": true
    },
    "include": ["app/src/**/*"]
}
```
!!Após isso será gerado dentro de dist o arquivo sourcemap .map
Exemplo:
```js
    {
    "version": 3,
    "file": "negociacao-controller.js",
    "sourceRoot": "",
    "sources": [
        "../../../src/controllers/negociacao-controller.ts" //aqui diz para onde 
																														//ele está apontando
    ],
    "names": [],
    "mappings": "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"
}
```

Esse arquivo que permite em tempo de dev colocarmos breakpoint no arquivo 
typescript e debugar no navegador como se o código estiver rodando em typescript.

!!Requisitos:
    >>> "sourceMap": true
    >>> Infraestrutua em ambiente de dev que compartilha as pastas dist e source 
    >>>Por isso a infraestrutua desse projeto está com a pasta dist e src dentro 
		de app, para que o liteserver compartilhe as duas pastas
    
!!Nunca em produção

    ```js
        "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
  >>>>  "server": "lite-server --baseDir=app", 
        "start": "concurrently \"npm run watch\" \"npm run server\"",
        "compile": "tsc",
        "watch": "tsc -w"
  },
```
Após isso abrir o inspect do navegador e ctrl+p para localizar o arquivo.