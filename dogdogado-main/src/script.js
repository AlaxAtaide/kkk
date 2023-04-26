

// Efeito Underline na página ativa (Underline Effect in the active page)
const currentLocation = location.href;
const menuItems = document.querySelectorAll('.nav-links a');
const menuLength = menuItems.length;

for (let i = 0; i < menuLength; i++) {
  if (menuItems[i].href === currentLocation) {
    menuItems[i].classList.add('active');
  }
}

// Efeito Modo Noturno (DARK MODE)
const header = document.querySelector('.body'); 
const icon = document.querySelector('.icon-js');


// Verifica o modo ativo pelo usuário a última vez que entrou
window.addEventListener('load', () => {
  const header = document.querySelector('.body'); 
  const icon = document.querySelector('.icon-js');

// Verifica o valor armazenado no localStorage (Dessa forma será aplicado entre light/dark em todas as páginas ao apertar o botão)
  if (localStorage.getItem('modoNoturno') === 'ativado') {
    header.classList.add('dark'); // Aplicar estilo de modo noturno
  }

  icon.addEventListener('click', () => {
    header.classList.toggle('dark');
    if (header.classList.contains('dark')) {
      localStorage.setItem('modoNoturno', 'ativado'); // Armazenar estado do modo noturno no localStorage
    } else {
      localStorage.removeItem('modoNoturno'); // Remover estado do modo noturno do localStorage
    }
  });
});




// INICIO DO BACK-END DO SITE

// CARRINHO DE COMPRA (SHOPPING CAR)

// Garante que o DOM tenha sido carregado antes de executar o código
document.addEventListener('DOMContentLoaded', () => {
  // Cria o seletor do elemento (button)
  let carts = document.querySelectorAll('.button');

  // Seletor dos elementos de produtos (neste exemplo, assumindo que cada produto tem a classe 'product')
  let products = document.querySelectorAll('.card');

  let productsData = []; // Array para armazenar os dados dos produtos

  // Itera sobre os elementos de produtos para extrair os dados
  products.forEach(product => {
    let name = product.querySelector('.name').textContent; // Nome do produto
    let desc = product.querySelector('.desc').textContent; // Descrição (tag) do produto
    let price = parseInt(product.querySelector('.price').textContent); // Preço do produto (convertido para número)
    let tag = product.querySelector('img').getAttribute('src'); // Recebe o nome da imagem do produto


  // Formata o preço com o símbolo de moeda "R$" e dois dígitos após a vírgula
    let formattedPrice = price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // Atualiza o elemento HTML com o preço formatado
    product.querySelector('.price').textContent = formattedPrice;


// Armazene o nome da imagem no objeto "productData"
let productData = {
  name: name,
  desc: desc,
  price: price,
  inCart: 0,
  tag: tag
};



    // Adiciona o objeto de dados do produto ao array
    productsData.push(productData);
  });

  
    // Loop para ir de 0 até a quantidade de elementos (cards) da minha página
  for (let i = 0; i < carts.length; i++) {
    carts[i].addEventListener('click', () => {
      cartNumbers(productsData[i]); 
      custoTotal(productsData[i])
    })
  }

    // Função para atualizar o número de itens no carrinho quando a página é carregada
  function onLoadCartNumbers() {
    let productNumbers = localStorage.getItem('cartNumbers');  
    // Verifica se há itens no carrinho no localStorage
    if (productNumbers) {
      document.querySelector('.qtdcart').textContent = productNumbers;


    // Atualiza a visibilidade do elemento .qtdcart
    if (parseInt(productNumbers) > 0) {
      document.querySelector('.qtdcart').style.visibility = 'visible';
    } else {
      document.querySelector('.qtdcart').style.visibility = 'hidden';
    }
    }
  }
  
  function cartNumbers(product) {
    
    let productNumbers = localStorage.getItem('cartNumbers');

    productNumbers = parseInt(productNumbers)

    if (productNumbers) {
      localStorage.setItem('cartNumbers', productNumbers + 1);
      document.querySelector('.qtdcart').textContent = productNumbers + 1;
    } else {
      localStorage.setItem('cartNumbers', 1);
      document.querySelector('.qtdcart').textContent = 1;
    }

    // Atualiza a visibilidade do elemento .qtdcart
    if (parseInt(localStorage.getItem('cartNumbers')) > 0) {
      document.querySelector('.qtdcart').style.visibility = 'visible';
    } else {
      document.querySelector('.qtdcart').style.visibility = 'hidden';
    }

    setItems(product);

    function setItems(product) {
      let cartItems = localStorage.getItem('productsInCart')
      cartItems = JSON.parse(cartItems)


      if(cartItems != null) {

        if(cartItems[product.name] == undefined) {
          cartItems = {
            ...cartItems,
            [product.name]: product
          }
        }
        cartItems[product.name].inCart += 1;
      } else {
        product.inCart = 1;
        cartItems = {
          [product.name]: product
        }
      }


    
      localStorage.setItem("productsInCart", JSON.stringify
      (cartItems));
    }

  }

  function custoTotal(product) {

        //console.log("O preço do produto é", product.price);
 
        let cartCusto = localStorage.getItem('custoTotal');

        console.log("Meu custoTotal é", cartCusto);
        console.log(typeof cartCusto);
      
    
      if(cartCusto != null) {
        cartCusto = parseInt(cartCusto);
        localStorage.setItem("custoTotal", cartCusto +
         product.price);
      } else {
        localStorage.setItem("custoTotal", product.price);
      }

  }

  function displayCart() {
    let cartItems = localStorage.getItem("productsInCart");
    cartItems = JSON.parse(cartItems);
  
    let productContainer = document.querySelector(".products");
    let cartCusto = localStorage.getItem('custoTotal');
  
    if(cartItems && productContainer) {
      productContainer.innerHTML = '';
      Object.values(cartItems).map(item => {
        productContainer.innerHTML += `
          <div class="product">
            <ion-icon name="close-circle" class="close" data-name="${item.name}"></ion-icon>
            <img src="./${item.tag}">
            <span>${item.name}</span>
            <div class="pricer">${item.price},00</div>
            <div class="quantity">
              <ion-icon class="decrease" data-name="${item.name}" name="caret-back-circle"></ion-icon>
              <span>${item.inCart}</span>
              <ion-icon class="increase" data-name="${item.name}" name="caret-forward-circle"></ion-icon>
            </div>
            <div class="total">
              R$${item.inCart * item.price},00
            </div>
          </div>
        `;
      });

      productContainer.innerHTML += `
      <div class="basketTotalContainer">
          <h4 class="basketTotalTittle">
          Custo Total:
          </h4>
          <h4 class="basketTotal">
           R$ ${cartCusto},00
          </h4>
          </div>
    `
  
      // Seleciona todos os botões de diminuir quantidade
      let decreaseButtons = document.querySelectorAll('.decrease');
  
      // Adiciona um evento de clique para cada botão
      decreaseButtons.forEach(button => {
        button.addEventListener('click', () => {
          let productName = button.getAttribute('data-name');
          let cartItems = JSON.parse(localStorage.getItem('productsInCart'));
          let cartCost = parseInt(localStorage.getItem('custoTotal'));
  
          // Se o produto tiver mais de 1 item no carrinho
          if (cartItems[productName].inCart > 1) {
            cartItems[productName].inCart -= 1;
            localStorage.setItem('productsInCart', JSON.stringify(cartItems));
            localStorage.setItem('custoTotal', cartCost - cartItems[productName].price);
            displayCart();
          }
        });
      });
  
      // Seleciona todos os botões de aumentar quantidade
      let increaseButtons = document.querySelectorAll('.increase');
  
      // Adiciona um evento de clique para cada botão
      increaseButtons.forEach(button => {
        button.addEventListener('click', () => {
          let productName = button.getAttribute('data-name');
          let cartItems = JSON.parse(localStorage.getItem('productsInCart'));
          let cartCost = parseInt(localStorage.getItem('custoTotal'));
  
          cartItems[productName].inCart += 1;
          localStorage.setItem('productsInCart', JSON.stringify(cartItems));
          localStorage.setItem('custoTotal', cartCost + cartItems[productName].price);
          displayCart();
        });
      });
  
      // Atualiza o valor total do carrinho
      let cartTotal = document.querySelector('.cartTotal');
  
      if (cartTotal) {
        cartTotal.textContent = `Total: R$${cartCusto},00`;
      }
    }
  }

  //Remove o ite do carrinho 
  function removeCartItem(event) {
    const productName = event.target.dataset.name;
    let cartItems = JSON.parse(localStorage.getItem("productsInCart"));
  
    if (cartItems && cartItems[productName]) {
      const product = cartItems[productName];
      product.inCart -= 1;
      if (product.inCart === 0) {
        delete cartItems[productName];
      }
  
      localStorage.setItem("productsInCart", JSON.stringify(cartItems));
  
      const productNumbers = parseInt(localStorage.getItem("cartNumbers"));
      localStorage.setItem("cartNumbers", productNumbers - 1);
      document.querySelector(".qtdcart").textContent = productNumbers - 1;
  
      let cartCost = parseInt(localStorage.getItem("custoTotal"));
      localStorage.setItem("custoTotal", cartCost - product.price);
  
      event.target.parentElement.remove();
    }
  }
  
  document.querySelector(".products").addEventListener("click", function(event) {
    if (event.target.classList.contains("close")) {
      removeCartItem(event);
    }
  });
  

    

  // Chama a função onLoadCartNumbers() para atualizar o número de itens no carrinho quando a página for carregada
  onLoadCartNumbers();
  displayCart();


});
