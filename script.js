//variavél que vai guardar o key de cada pizza
let modalKey = 0;

//variavél que vai guardar os itens do carrinho
let cart = [];

//variavél que vai conter a quantidade de pizzas no modal
let modalQt = 1;

//Orientação ao objeto, para q gente escreva menos código
/*const c = (el) => {
    return document.querySelector(el);
} ou podemos fazer assim*/
 //uma função anônima
const c = (el) => document.querySelector(el);
//vamos fazer uma orientação a objeto para o All também
const cs = (el) => document.querySelectorAll(el);

//listagem das pizzas
pizzaJson.map((item, index) => {
    //variavel para clonar cada item e jogar na tela
    let pizzaItem = c ('.models .pizza-item').cloneNode(true);

    //adicionando o key de cada pizza
    pizzaItem.setAttribute('data-key', index);
    //adicionando informações das pizzas
    pizzaItem.querySelector('.pizza-item--img img').src = item.img;
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `R$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    //evento de clique no modal da pízza para atualizar a tela
    pizzaItem.querySelector('a').addEventListener('click', (e) => {
        e.preventDefault();        

        //ação para pegar as informações de cada pizza, .closest vai voltar e pegar a informação
        let key = e.target.closest('.pizza-item').getAttribute('data-key');

        //evento para que a quantidade de pizzas sempre seja 1
        modalQt = 1;

        //variavél que vai eternizar o key de cada pizza para não se perder quando clicar no modal
        modalKey = key;

        //preenchendo as informações no modal com cada pizza
        c('.pizzaBig img').src = pizzaJson[key].img;
        c('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        c('.pizzaInfo--actualPrice').innerHTML =  `R$ ${pizzaJson[key].price.toFixed(2)}`;
        c('.pizzaInfo--size.selected').classList.remove('selected');
        cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
            if(sizeIndex === 2) {
                size.classList.add('selected');
            }
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeIndex];
        });

        //função para colocar a quantidades de pizzas no modal
        c('.pizzaInfo--qt').innerHTML = modalQt;


        //aparecer o modal da pizza
        c('.pizzaWindowArea').style.opacity = 0;
        c('.pizzaWindowArea').style.display = 'flex';
        setTimeout(() => {
            c('.pizzaWindowArea').style.opacity = 1;
        }, 200);
    });
    

    //função que vai adicionar um item novo apend(), ele sempre vai adicionar
    c('.pizza-area').append(pizzaItem);
});

//eventos do modal
function closeModal() {
    //função para fechar o modal
    c('.pizzaWindowArea').style.opacity = 0;
        setTimeout(() => {            
        c('.pizzaWindowArea').style.display = 'none';
        }, 500);
}

//funçaõ que vai fechar o modal no computador e no celular
cs('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton').forEach((item) => {
    item.addEventListener('click', closeModal);
});

//ação de click nos botões de menus e mais do modal
c('.pizzaInfo--qtmenos').addEventListener('click', () =>{
    if(modalQt > 1) {
        modalQt --;
    //atualizando com o nova quantidade no modal
    c('.pizzaInfo--qt').innerHTML = modalQt;
    }/*else if(modalQt < 1) {
        closeModal;
    }*/    
});
c('.pizzaInfo--qtmais').addEventListener('click', () =>{
    modalQt ++;
    //atualizando com o nova quantidade no modal
    c('.pizzaInfo--qt').innerHTML = modalQt;
});

//ação para mudar os tamanhos da pizza
cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
    size.addEventListener('click', (e) => {
        //primeiro vamos desmarcar todos e depois vamos marcar o que for clicado
        c('.pizzaInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

//ação para colocar o item no carrinho
c('.pizzaInfo--addButton').addEventListener('click', () => {
    //variavél para pegar o tamanho da pizza e colocar no carrinho
    let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'));

    //variavél para identificar se apizza tem o mesmo tamanho e quantidades
    let identifier = pizzaJson[modalKey].id+'@'+size;

    //variavél para identificar se tem o mesmo identifire
    /*let key = cart.findIndex((item) => {
        return item.identifier = identifier
    }); ou pode fazer assim:*/
    let key = cart.findIndex((item) => item.identifier == identifier);

    //condição para verificar se tem o mesmo item identificador
    if(key > -1) {
        cart[key].qt += modalQt;
    }else{
        //ação para adicionar no carrinho
        cart.push({
            identifier,
            id: pizzaJson[modalKey].id,
            size,
            qt: modalQt
        });
    }
    
    //antes de fechar ele vai atualizar o carrinho
    updateCart();

    //depois de selecionar a pizza vamos fechar o modal
    closeModal();
    
});

//função que vai abrir o carrinho no celular
c('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0) {
        c('aside').style.left = '0';
    }
});

//função que vai fechar o carrinho quandoe stiver no celular
c('.menu-closer').addEventListener('click', () => {
    c('aside').style.left = '100vw';
})

//função para atualizar o carrinho
function updateCart() {
    //função que vai atualizar o carrinho quando estive no celular
    c('.menu-openner span').innerHTML = cart.length;

    //consdição se tivar algo maior que zero
    if(cart.length > 0) {
        //função que vai fazer o carrinho aparecer
        c('aside').classList.add('show');

        /*zerando a lista do carrinho porque senão ele vai adicionar mais coisas na
        lista, e isso não quermos*/
        c('.cart').innerHTML = '';

        //variável que vai conter os total e descontos dentro do carrinho
        let subtotal = 0;
        let desconto = 0;
        let total = 0;

        //condição para mapear qual é o item ou pizza que está sendo mostrado
        for(let i in cart) {
            //variavél que vai retornar a pizza
            let pizzaItem = pizzaJson.find((item) => item.id == cart[i].id);
            //fazendo o calculo da pizza vezes a quantidade
            subtotal += pizzaItem.price * cart[i].qt;

            //pegar todo mundo o carrinho e clonar
            let cartItem = c('.models .cart--item').cloneNode(true);

            //variável que vai ter o nome da pizza com o tamanho dela
            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P';
                    break;
                case 1:
                    pizzaSizeName = 'M';
                    break;
                case 2:
                    pizzaSizeName = 'G';
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`;

            //preenchendo as informações do carrinho
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            //fazendo a ação do botão de mais e menos dentro do carrinho
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                cart[i].qt++;
                updateCart();
            });
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                if(cart[i].qt > 1) {
                    cart[i].qt--;
                }else {
                    cart.splice(i,1);
                }
                updateCart();
            });


            //vamos exibir o nosso clone na tela dentro do carrinho
            c('.cart').append(cartItem);
        }

        //fazendo o desconto dew 10% no preço da pizza
        desconto = subtotal * 0.1;
        total = subtotal - desconto;

        //exibindo os preços na tela
        c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
        c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
        c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
    }else {
        c('aside').classList.remove('show');
        //fechando após tirar todos os itens do carrinho no celular
        c('aside').style.left = '100vw';
    }
}