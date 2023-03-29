const arrItems = [

];
const hBody = document.querySelector('.hbody');

function addItem() {
    let catgroy = document.querySelector('#itemCatgory').value;
    let name = document.querySelector('#itemName').value;
    let bulding = document.querySelector('#itemBuilding').value;
    let price = document.querySelector('#itemPrice')
    // let description = document.querySelector('#itemDescription').value;
    let img = document.querySelector('#itemFileImg');
    let fileImg = img.files;

    let object = {
        itemCatgory: catgroy,
        itemName: name,
        itemBuilding: bulding,
        itemPrice: price,
        // itemDescription: description,
        itemFileImg: fileImg[0]
    }

    arrItems.push(object);
}

function createItem(item) {

    let post = `
    <div class="item">
        <div style="background-image: url('${URL.createObjectURL(item.itemFileImg)}');" class="itemImg"></div>
        <div class="rightBar">
            <div class="itemCatgory">${item.itemCatgory}</div>
            <div class="itemName">${item.itemName}</div>
            <button type="button" class="btn btn-danger">Delete</button>
            <button type="button" class="btn btn-success">Edit</button>
            <div class="itemPrice">${item.itemPrice}<span>SR</span></div>
        </div>
    </div>
    `;
    hBody.innerHTML += post;
}

function genrateItems() {
    arrItems.forEach(elemnt => {
        createItem(elemnt)
    })
}
genrateItems()
