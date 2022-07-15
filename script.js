let cart = [];
let modalKey = 0

const c = (el) => document.querySelector(el);
const cs = (el) => document.querySelectorAll(el);

/* listagem das pizzas*/
foodJson.map ((item, index) =>{
    let foodItem = c('.models .food-item').cloneNode(true);

    foodItem.setAttribute('data-key', index );

    foodItem.querySelector('.food-item--img img').src = item.img;

    foodItem.querySelector('.food-item--price').innerHTML = "R$ " + item.price.toFixed(2);

    foodItem.querySelector('.food-item--name').innerHTML = item.name;

    foodItem.querySelector('.food-item--desc').innerHTML = item.description;


/* ABERTURA MODAL */
    foodItem.querySelector('a').addEventListener('click', (e) =>{
       /*tirar ação padrão do link a (atualizar a tela)*/
        e.preventDefault();

      /*reconhecer pizza clicada através do atributo (id)*/
        let key = e.target.closest('.food-item').getAttribute('data-key');
        modalQt = 1;
        modalKey = key

        /* preencher informações após o clique*/

    c('.foodBig img').src = foodJson[key].img;

    c('.foodInfo h1').innerHTML = foodJson[key].name;

    c('.foodInfo--desc').innerHTML = foodJson[key].description;

    c('.foodInfo--actualPrice').innerHTML = foodJson[key].price.toFixed(2);

    c('.foodInfo--size.selected').classList.remove('selected');

    cs('.foodInfo--size').forEach((size, sizeIndex)=>{

        if(sizeIndex == 2){
            size.classList.add('selected');
        }

        size.querySelector('span').innerHTML = foodJson[key].sizes[sizeIndex]; 
    });

    c('.foodInfo--qt').innerHTML = modalQt;


    /*animação clique modal*/
    c('.foodWindowArea').style.opacity = 0;
    c('.foodWindowArea').style.display = 'flex';
        setTimeout (() =>{
        c('.foodWindowArea').style.opacity = 1;
    }, 200);
});

    c('.food-area').append (foodItem);

});

/* eventos do modal */

/* FECHAMENTO MODAL */

function closeModal() {
    c('.foodWindowArea').style.opacity = 0;
    setTimeout(() =>{
    c('.foodWindowArea').style.display = 'none';
    }, 500);
}

cs('.foodInfo--cancelButton, .foodInfo--cancelMobileButton').forEach((item) =>{
    item.addEventListener ('click', closeModal)
});

/* BOTAO ADICIONAR E REMOVER 1 DO CARRINHO */
c('.foodInfo--qtmenos').addEventListener('click', () =>{
    if (modalQt > 1){
    modalQt --;
    c('.foodInfo--qt').innerHTML = modalQt;
    } if (modalQt = 1){
    }
});

/* SELETOR DE TAMANHOS */
c('.foodInfo--qtmais').addEventListener('click', () =>{
    modalQt ++;
    c('.foodInfo--qt').innerHTML = modalQt;
});
 

cs('.foodInfo--size').forEach((size, sizeIndex)=>{
    size.addEventListener('click', (e) =>{
        c('.foodInfo--size.selected').classList.remove('selected');
        size.classList.add('selected');
    });
});

/*ADICIONAR AO CARRINHO!!!!!!!!*/

c('.foodInfo--addButton').addEventListener('click', () => {
    let size = parseInt(c('.foodInfo--size.selected').getAttribute('data-key'));
    let identifier =  foodJson[modalKey].id + '@' + size;
    let key = cart.findIndex((item) => item.identifier == identifier);
    if(key > -1){
        cart[key].qt += modalQt;
    } else{
   cart.push({
    identifier,
    id: foodJson[modalKey].id,
    size,
    qt: modalQt
   });
} 
   updateCart();
   closeModal();
});

c('.menu-openner').addEventListener('click', () =>{
    if(cart.length > 0){
    c('aside').style.left = '0';
    }
});

c('.menu-closer').addEventListener('click', () =>{
    c('aside').style.left = '100vw';
});

function updateCart () {

    c('.menu-openner span').innerHTML = cart.length;

    if (cart.length > 0){
        c('aside').classList.add('show');
        c('.cart').innerHTML = '';

        let subtotal = 0;
        let desconto = 0;
        let total = 0;


        for (let i in cart){
            let foodItem = foodJson.find((item) => item.id == cart[i].id);
            subtotal += foodItem.price * cart[i].qt;

            let cartItem = c('.models .cart--item').cloneNode(true);

            let foodSizeName;
            switch(cart[i].size){
                case 0:
                    foodSizeName = '(P)'
                    break;
                case 1:
                    foodSizeName = '(M)'
                    break;
                case 2:
                    foodSizeName = '(G)'
                    break;
            }

            let foodName = `${foodItem.name} ${foodSizeName}`;


            cartItem.querySelector('img').src = foodItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = foodName;
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt;

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () =>{
                cart[i].qt++;
                updateCart();
          });

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () =>{
                if (cart[i].qt > 1){
                    cart [i].qt--;
                }
                else{
                    cart.splice(i, 1);
                }
                updateCart();
          });

            c('.cart').append(cartItem);

            desconto = subtotal * 0.1;
            total = subtotal - desconto;

            c('.subtotal span:last-child').innerHTML = `R$ ${subtotal.toFixed(2)}`;
            c('.desconto span:last-child').innerHTML = `R$ ${desconto.toFixed(2)}`;
            c('.total span:last-child').innerHTML = `R$ ${total.toFixed(2)}`;
        }
    } else{
        c('aside').classList.remove('show');
        c('aside').style.left = '100vh';
    }
}