
arrItems = [
    {
        id:0,
        img:'https://www.mintmobile.com/wp-content/uploads/2022/09/iPhone_14_Plus_ProductRED_PDP_Image_Position-1A__en-US-min-1.png',
        name: 'Sofa',
        category: 'Catgroy',
        price: 300,
        description:"this is my "
    },
    {
        id:1,
        img:'https://www.mintmobile.com/wp-content/uploads/2022/09/iPhone_14_Plus_ProductRED_PDP_Image_Position-1A__en-US-min-1.png',
        name: 'Sofa',
        category: 'Catgroy',
        price: 300,
        description:"this is my "
    },
    {
        id:2,
        img:'https://www.mintmobile.com/wp-content/uploads/2022/09/iPhone_14_Plus_ProductRED_PDP_Image_Position-1A__en-US-min-1.png',
        name: 'Sofa',
        category: 'Catgroy',
        price: 300,
        description:"this is my "
    },
];

function itemChosen(item) {
    clearItemsColor()
    item.style.backgroundColor = "white";
    item.style.color = 'red';
    document.querySelector('.rightBar').innerHTML = '';
    let id = item.id;
    let selectITem = arrItems[id];
    let post  = `
    <div class="rightBar">
          <!-- <img class="shopImage" src="https://img.freepik.com/free-vector/cartoon-style-cafe-front-shop-view_134830-697.jpg" alt="">
          <div class="headr">Your items</div> -->
          <div class="thisItemImg" style="background-image: url('https://www.mintmobile.com/wp-content/uploads/2022/09/iPhone_14_Plus_ProductRED_PDP_Image_Position-1A__en-US-min-1.png');"></div>
          <div class='thisItemDesc'>
            Description: <br> ${selectITem.description}
          </div>
          <div class="infoBar">
            <div class="leftInfo">
              name: ${selectITem.name} <br>
              price: ${selectITem.price} 
            </div>
            <div class="rightInfo">
              Catgroy: Catgroy <br>
              Date posted: 2023
            </div>
          </div>
          <div class="contactInfo">
            people who wants this item: <br>
            badr@hotmail.com <br>
            salman@gmail.com 
          </div>
          <div class="btnBar">
            <button type="button" id='${item.id}' class="btn btn-primary editBtn">Edit</button>
            <button type="button" id='${item.id}' class="btn btn-danger closeBtn">Close</button>
          </div>
        </div>
    `;
    document.querySelector('.rightBar').innerHTML = '';
    document.querySelector('.rightBar').innerHTML = post;
    dialogFunction(post,item);
    
}

function dialogFunction(post,itemSelcted) {
    document.querySelector('.editBtn').addEventListener('click',(elemnt)=>{
        let thisID = elemnt.target.id;
        document.querySelector('.rightBar').innerHTML+= `
        <dialog>
        <p>
            <label for="name">Name: <input required id="dialName" type="text"></label>
        </p>
        <p>
            <label for="price">price: <input required id="dialPrice" type="text"></label>
        </p>
        <p>
            <label for="desc">Description: <br> <textarea required id="dialDesc" name="" id="" cols="50" rows="3"></textarea></label>
        </p>
        <p>
            <button id="${thisID}" type="button" class="btn btn-success confirmBtn">Confirm</button>
            <button id="${thisID}" type="button" class="btn btn-danger cancleBtn">Cancle</button>
        </p>
        </dialog>
        `;
        document.querySelector('dialog').showModal()
        document.querySelector('.cancleBtn').addEventListener('click',(el)=>{
            document.querySelector('dialog').close();
            document.querySelector('.rightBar').innerHTML = "";
            document.querySelector('.rightBar').innerHTML = post;
            dialogFunction(post);
        })

        document.querySelector('.confirmBtn').addEventListener('click',(el)=>{
            arrItems.forEach(item => {
                if (item.id == Number(thisID)) {
                    arrItems[thisID].name = document.querySelector('#dialName').value;
                    arrItems[thisID].price = document.querySelector('#dialPrice').value;
                    arrItems[thisID].description = document.querySelector('#dialDesc').value;
                    itemChosen(itemSelcted);
                    document.querySelector('dialog').close();
                    document.querySelector('.rightBar').innerHTML = "";
                    document.querySelector('.rightBar').innerHTML = post;
                }
            })
        })


    })
}

function clearItemsColor() {
    document.querySelectorAll('.item0').forEach(elemnt => {elemnt.style.backgroundColor='#9DC08B';elemnt.style.color = 'white';});
}
function addItem() {
    let catgroy = document.querySelector('#itemCategory').value;
    let name = document.querySelector('#itemName').value;
    let bulding = document.querySelector('#itemBuilding').value;
    let price = document.querySelector('#itemPrice')
    // let description = document.querySelector('#itemDescription').value;
    let img = document.querySelector('#itemFileImg');
    let fileImg = img.files;

    let object = {
        itemCategory: catgroy,
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
    <div id='${item.id}' class="item0">
        <div style="background-image: url(${item.img});" class="itemImg0"></div>
        <div class="itemRightBar">
            <div class="itemCategory">${item.category}</div>
            <div class="itemName">${item.name}</div>
            <div class="itemPrice">${item.price}<span>SR</span></div>
        </div>
    </div>
    `;
    document.querySelector('.leftBar').innerHTML += post;
}

function genrateItems() {
    arrItems.forEach(elemnt => {
        createItem(elemnt)
    })
}
genrateItems()
//adding event listner for items
document.querySelectorAll('.item0').forEach(item => item.addEventListener('click',elemnt=>{
    itemChosen(item);
}))