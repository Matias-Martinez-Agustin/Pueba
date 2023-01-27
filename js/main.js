
const cards = document.getElementById('cards')
const templateCard = document.getElementById('template-card').content
const fragment = document.createDocumentFragment()
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const items = document.getElementById('items')
const footer = document.getElementById('footer')
let carrito = {}

//EVENTOS
document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})
cards.addEventListener('click', e =>{
    addCarrito(e)
})

items.addEventListener('click', e => {
    btnAccion(e)
})
//Capturar los datos de api.json
let data;
const fetchData = async () => {
    try {
        const res = await fetch('api.json')
        data = await res.json()
        //console.log(data)
        pintarCard(data)
    } catch (error) {
        //console.log(error)
    }
}
const pintarCard = data => {
    data.forEach(producto =>{
        templateCard.querySelector('h5').textContent = producto.title
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('img').setAttribute('src', producto.img)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
        //console.log(producto);
    })
    cards.appendChild(fragment)
}

const addCarrito = e => {
    //console.log(e.target);
    //console.log(e.target.classList.contains('btn-dark'));
    if(e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement)
        //console.log(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    //console.log(objeto);
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }
    
    if(carrito.hasOwnProperty(producto.id)){
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = {...producto}
    pintarCarrito()
    //console.log(carrito);
}

const pintarCarrito = () => {
    //console.log(carrito);
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio
        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    })
    items.appendChild(fragment)

    pintarFooter()
    //Guardo en el localStorage
    localStorage.setItem('carrito', JSON.stringify(carrito))
}
const pintarFooter = () => {
    footer.innerHTML = ''
    if(Object.keys(carrito).length === 0){
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `
        return
    }
    const cantidadFinal = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad,0)
    const precioFinal = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio,0)
    //console.log(cantidadFinal);
    //console.log(precioFinal);
    templateFooter.querySelectorAll('td')[0].textContent = cantidadFinal
    templateFooter.querySelector('span').textContent = precioFinal
    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)
    //Evento vaciar carrito
    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () =>{
        carrito = {}
        pintarCarrito()
    })
}

const btnAccion = e => {
    //console.log(e.target);
    //Accion de aumentar
    if(e.target.classList.contains('btn-info')){
        carrito[e.target.dataset.id]
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++
        carrito[e.target.dataset.id] = {...producto}
        pintarCarrito()
    }
    //Accion de disminuir
    if(e.target.classList.contains('btn-danger')){
        carrito[e.target.dataset.id]
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
    }
    //Detengo cualquier otro evento que se pueda generar
    e.stopPropagation()
}

//console.log(data);
function filtrarLibros(filtro){
  console.log(filtro);
    let filtrado = data.filter((el) => {
        console.log(el.title);
     return el.title.includes(filtro);
   });
   console.log(filtrado);
    return filtrado;

}
//console.log(search);
   search.addEventListener("input", () => {
    let filtro = filtrarLibros(search.value)
console.log(filtro);
    pintarCarrito(filtro)
 })
