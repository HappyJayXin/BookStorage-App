//Data Module:DataController
var DataController=(function(){

var Romance=function(id,bookname,bookmoney,bookdate){
    this.id=id;
    this.bookname=bookname;
    this.bookmoney=bookmoney;
    this.bookdate=bookdate;
}


var Classic=function(id,bookname,bookmoney,bookdate){
    this.id=id;
    this.bookname=bookname;
    this.bookmoney=bookmoney;
    this.bookdate=bookdate;
}


var Fantasy=function(id,bookname,bookmoney,bookdate){
    this.id=id;
    this.bookname=bookname;
    this.bookmoney=bookmoney;
    this.bookdate=bookdate;
}

var data=JSON.parse(localStorage.getItem('data'))||{
allitems:{
rom:[],
cla:[],
fan:[]
},
totals:{
money:0,
books:0
},
eachtotal:{
    rom:0,
    cla:0,
    fan:0
},eachbooks:{
    rom:0,
    cla:0,
    fan:0
},eachpercentage:{
    rom:-1,
    cla:-1,
    fan:-1
},indexid:0

}

function calceachTotal(type){
var sum=0;
data.allitems[type].forEach(item=>{
    sum+=item.bookmoney;
});
data.eachtotal[type]=sum;
}

function calceachBooks(type){
    var sum=0;
    data.allitems[type].forEach(item=>{
        sum++;
    });
    data.eachbooks[type]=sum;
}

function calculateP(type){
   if(data.totals.money<0)
   data.eachpercentage[type]=-1;
   else
   data.eachpercentage[type]=Math.round((data.eachtotal[type]/data.totals.money)*100);

}

//Data module methods
return{
    test:function(){
        return data;
    },
    addItem:function(type,name,money,date){
        var newItem,ID;
         if(data.allitems[type].length>0){
             ID=data.allitems[type][data.allitems[type].length-1].id+1;
         }
         else{
             ID=0;
         }

         if(type==='rom')
         {
           newItem=new Romance(ID,name,money,date);
         }
         else if(type==='cla'){
            newItem=new Classic(ID,name,money,date);
         }
         else if(type==='fan'){
            newItem=new Fantasy(ID,name,money,date);
         }
         data.allitems[type].push(newItem);
         localStorage.setItem('data',JSON.stringify(data));
         return data.allitems[type];
    },
    deleteItem:function(type,ID){
        var index;
        data.allitems[type].forEach(item=>{
            if(ID===item.id)
            index=item.id;
        });
        data.allitems[type].splice(index,1);
        localStorage.setItem('data',JSON.stringify(data));
    },
     changeItem:function(ID,type,bookname,bookmoney,bookdate){
    
        data.allitems[type].forEach((item,i)=>{
            if(ID===item.id)
            {
                item.bookname=bookname;
                item.bookmoney=bookmoney;
                item.bookdate=bookdate;
            }
        });
        localStorage.setItem('data',JSON.stringify(data));
     },

    calcTotal:function(){
        calceachTotal('rom');
        calceachTotal('cla');
        calceachTotal('fan');
        calceachBooks('rom');
        calceachBooks('cla');
        calceachBooks('fan');
        data.totals.money=data.eachtotal.rom+data.eachtotal.cla+data.eachtotal.fan;
        data.totals.books=data.eachbooks.rom+data.eachbooks.cla+data.eachbooks.fan;
        localStorage.setItem('data',JSON.stringify(data));
    },
    calcPercentages:function(){
        calculateP('rom');
        calculateP('cla');
        calculateP('fan');
     localStorage.setItem('data',JSON.stringify(data));
    },
    getTotal:function(){
        return{
            totalmoney:data.totals.money,
            totalbooks:data.totals.books,
            rommoney:data.eachtotal.rom,
            clamoney:data.eachtotal.cla,
            fanmoney:data.eachtotal.fan
        }
    },
    getPercentages:function(){
        return{
           rompercentage:data.eachpercentage.rom,
           clapercentage:data.eachpercentage.cla,
           fanpercentage:data.eachpercentage.fan,
        }
    },
    getInitItemList:function(){
        return{
            romitemList:data.allitems.rom,
            claitemList:data.allitems.cla,
            fanitemList:data.allitems.fan
        }
    },
    getItemdata:function(type,ID){
        var indexitem;
      data.allitems[type].forEach((item,i)=>{
          if(ID===item.id){
            indexitem=item;
           data.indexid=item.id;
        }
      });
      return indexitem;
    },
    getIndexId:function(){
        return data.indexid;
    },
    getItemList:function(type){
        return data.allitems[type];
    }
}



})();

//UI Module:User Interface
var UIController=(function(){
    var DOMstrings={
        inputType:'.add__type',
        inputBookName:'.add__bookname',
        inputBookMoney:'.add__bookmoney',
        inputBtn:'.add__btn',
        inputBtnChange:'i[data-key="2"]',
        inputBtnDelete:'i[data-key="1"]',
        inputBookDate:'.add__bookdate',
        romList:'.romance__list',
        claList:'.classic__list',
        fanList:'.fantasy__list',
        totalmoneyLabel:'.bookstore__value--totalmoney',
        totalbooksLabel:'.bookstore__value--totalcount',
        rommoneyLabel:'.romance__totalmoney',
        clamoneyLabel:'.classic__totalmoney',
        fanmoneyLabel:'.fantasy__totalmoney',
        container:'.container',
        romPercentage:'.romance__percentage',
        claPercentage:'.classic__percentage',
        fanPercentage:'.fantasy__percentage',
        dateLabel:'.bookstore__title--month',
        cancelBtn:'.cancel__btn',
        changeBtn:'.change__btn'
    }
     
   function formatNum(num){
     num=num.toFixed(2);
     let [inc,dec]=num.split('.');
     if(inc.length>3)
     {
      inc=inc.substr(0,inc.length-3)+','+inc.substr(inc.length-3,3);
      return inc+'.'+dec;
     }
     else
     return inc+'.'+dec;
   }

  function changeT(input){
      var type=document.querySelector(DOMstrings.inputType).value;
      var btn=document.querySelector(DOMstrings.inputBtn);
    if(type==='rom')
    {
      input.classList.remove('fan-focus');
      input.classList.remove('cla-focus');
      input.classList.add('rom-focus');         
      btn.classList.remove('fan');
      btn.classList.remove('cla');
      btn.classList.add('rom');
    }
    else if(type==='cla'){
      input.classList.remove('fan-focus');
      input.classList.remove('rom-focus');
      input.classList.add('cla-focus');
      btn.classList.remove('rom');
      btn.classList.remove('fan');
      btn.classList.add('cla');
    }
    else if(type==='fan'){
      input.classList.remove('rom-focus');
      input.classList.remove('cla-focus');
      input.classList.add('fan-focus');
      btn.classList.remove('rom');
      btn.classList.remove('cla');
      btn.classList.add('fan');
    
    }
  }

    //UI module methods
    return{
        getDOMstrings:function(){
            return DOMstrings;
        },
        getinput:function(){
            return{
                type:document.querySelector(DOMstrings.inputType).value,
                bookname:document.querySelector(DOMstrings.inputBookName).value,
                bookmoney:parseFloat(document.querySelector(DOMstrings.inputBookMoney).value),
                bookdate:document.querySelector(DOMstrings.inputBookDate).value
            }
        },
        clearInputs:function(){
               document.querySelector(DOMstrings.inputBookName).value='';
               document.querySelector(DOMstrings.inputBookMoney).value='';
               document.querySelector(DOMstrings.inputBookDate).value='';
        },
        addItemtoList:function(type,Itemlist){
           var list,html='';
           if(type==='rom'){
             list=document.querySelector(DOMstrings.romList);
            Itemlist.forEach(item=>{
                html+=`<div class="item clearfix" id="rom-${item.id}">
                <div class="item__bookname">${item.bookname}</div>
              
                <div class="right clearfix">
                    <div class="item__moneydate">
                    <div class="item__bookmoney">${formatNum(item.bookmoney)}</div>
                    <div class="item__bookdate">${item.bookdate}</div>
                    </div>
                    <div class="item__delete">
                        <button class="item__change--btn" ><i class="ion-android-create" data-key="2"></i></button>
                        <button class="item__delete--btn"><i class="ion-ios-close-outline" data-key="1"></i></button>
                    </div>
                    
                </div>
            </div>`;
            });
           }
           else if(type==='cla'){
            list=document.querySelector(DOMstrings.claList);
            Itemlist.forEach(item=>{
                html+=`<div class="item clearfix" id="cla-${item.id}">
                <div class="item__bookname">${item.bookname}</div>
              
                <div class="right clearfix">
                    <div class="item__moneydate">
                    <div class="item__bookmoney">${formatNum(item.bookmoney)}</div>
                    <div class="item__bookdate">${item.bookdate}</div>
                    </div>
                    <div class="item__delete">
                    <button class="item__change--btn"><i class="ion-android-create" data-key="2"></i></button>
                        <button class="item__delete--btn"><i class="ion-ios-close-outline" data-key="1"></i></button>
                    </div>
                    
                </div>
            </div>`;
            });
            
           }
           else if(type==='fan'){
            list=document.querySelector(DOMstrings.fanList);
            Itemlist.forEach(item=>{
                html+=`<div class="item clearfix" id="fan-${item.id}">
                <div class="item__bookname">${item.bookname}</div>  
                <div class="right clearfix">
                    <div class="item__moneydate">
                    <div class="item__bookmoney">${formatNum(item.bookmoney)}</div>
                    <div class="item__bookdate">${item.bookdate}</div>
                   </div>
                    <div class="item__delete">
                    <button class="item__change--btn" ><i class="ion-android-create" data-key="2"></i></button>
                        <button class="item__delete--btn"><i class="ion-ios-close-outline" data-key="1"></i></button>
                    </div>
                    
                </div>
            </div>`;
            });
            
           }
           list.innerHTML=html;
        },
        deleteItemfromList:function(itemID){
           var item=document.getElementById(itemID);
           item.parentNode.removeChild(item);
        },
        displayTotal:function(Total){
           document.querySelector(DOMstrings.totalmoneyLabel).textContent=formatNum(Total.totalmoney);
           document.querySelector(DOMstrings.totalbooksLabel).textContent=Total.totalbooks;
           document.querySelector(DOMstrings.rommoneyLabel).textContent=formatNum(Total.rommoney);
           document.querySelector(DOMstrings.clamoneyLabel).textContent=formatNum(Total.clamoney);
           document.querySelector(DOMstrings.fanmoneyLabel).textContent=formatNum(Total.fanmoney);
        },
        displayPercentages:function(Percentages){
            Percentages.rompercentage>0
            ?document.querySelector(DOMstrings.romPercentage).textContent=Percentages.rompercentage+'%':document.querySelector(DOMstrings.romPercentage).textContent='－';
            
            Percentages.clapercentage>0?
            document.querySelector(DOMstrings.claPercentage).textContent=Percentages.clapercentage+'%':document.querySelector(DOMstrings.claPercentage).textContent='－';
            
            Percentages.fanpercentage>0?
            document.querySelector(DOMstrings.fanPercentage).textContent=Percentages.fanpercentage+'%':document.querySelector(DOMstrings.fanPercentage).textContent='－';
            
        },
        displayDate:function(){
            var now,year,month,months;
            months=['January','February','March','April','May','June','July'
            ,'August','September','October','November','December'];
            now=new Date();
            year=now.getUTCFullYear();
            month=now.getMonth();
            document.querySelector(DOMstrings.dateLabel).textContent=months[month]+' '+year;
        },
        changedType:function(){
            var type=document.querySelector(DOMstrings.inputType).value;
            var allinputs=[...document.querySelectorAll(DOMstrings.inputType+','+DOMstrings.inputBookName+','+DOMstrings.inputBookMoney+','+DOMstrings.inputBookDate)];
            allinputs.forEach(input=>{
                  changeT(input);
            });
        },
        putInput:function(type,bookname,bookmoney,bookdate){
            document.querySelector(DOMstrings.inputType).value=type;
            document.querySelector(DOMstrings.inputBookName).value=bookname;
            document.querySelector(DOMstrings.inputBookMoney).value=bookmoney;
            document.querySelector(DOMstrings.inputBookDate).value=bookdate;
            document.body.classList.add('change');
        },
        cancelChange:function(){
            document.body.classList.remove('change');
            
        }
    }
})();


//Controller Module:Global App Controller
var controller=(function(DataCtrl,UICtrl){

     function updateTotal(){
         var Total;
         DataCtrl.calcTotal();
         Total=DataCtrl.getTotal();
         UICtrl.displayTotal(Total);
     }

     function updatePercentages(){
         var Percentages;
         //1.Calculate percentages
      DataCtrl.calcPercentages();
      Percentages=DataCtrl.getPercentages();
         //2.Display percentage to UI
         UICtrl.displayPercentages(Percentages);
     }

    function ctrladdItem(){
        var input,newItem;
        //1.Get input values
        input=UICtrl.getinput();
      
        if(input.bookname!==''&&!isNaN(input.bookmoney)&&input.bookmoney>0&&input.bookdate!=='')
        {
        //2.Add new item to data
        Itemlist = DataCtrl.addItem(input.type,input.bookname,input.bookmoney,input.bookdate);
        //3.Add new item to UI
        UICtrl.addItemtoList(input.type,Itemlist);
        //4.Clear input fields
        UICtrl.clearInputs();
        //5.Calculate total money&books
        updateTotal();
        
        updatePercentages();
        }
    }

    function ctrldeleteItem(){
        var itemID,changebtn;
        btn = parseInt(event.target.dataset.key);
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
         if(btn===1)
        {
            let [type,id]=itemID.split('-');
            id=parseInt(id);
            //1.delete item from data
            DataCtrl.deleteItem(type,id);
            //2.delete item from UI
            UICtrl.deleteItemfromList(itemID);
            //3.re-calculate Total
            updateTotal();
       
             updatePercentages();
        }
        else if(btn===2)
        {
            var item;
           let [type,id]=itemID.split('-');
           id=parseInt(id);
           item= DataCtrl.getItemdata(type,id);
           UICtrl.putInput(type,item.bookname,item.bookmoney,item.bookdate);
        }
    }


    function ctrlchangeItem(){
        var Itemlist,input,id;
          input=UICtrl.getinput();
          if(input.bookname!==''&&!isNaN(input.bookmoney)&&input.bookmoney>0&&input.bookdate!==''){
         id=DataCtrl.getIndexId();
          DataCtrl.changeItem(id,input.type,input.bookname,input.bookmoney,input.bookdate);
          Itemlist=DataCtrl.getItemList(input.type);
          UICtrl.addItemtoList(input.type,Itemlist);
          UICtrl.cancelChange();
          UICtrl.clearInputs();
          updateTotal();
          updatePercentages();
        }
    }

      function displayInitItem(){
        var itemList=DataCtrl.getInitItemList();
        UICtrl.addItemtoList('rom',itemList.romitemList);
        UICtrl.addItemtoList('cla',itemList.claitemList);
        UICtrl.addItemtoList('fan',itemList.fanitemList);
      }

    function seteventListeners(){
        var DOMstrings=UIController.getDOMstrings();
        document.querySelector(DOMstrings.inputBtn).addEventListener('click',ctrladdItem);
        document.addEventListener('keypress',()=>{
            if(event.keyCode===13||event.which===13)
            ctrladdItem();
        });
        document.querySelector(DOMstrings.container).addEventListener('click',ctrldeleteItem);
        document.querySelector(DOMstrings.inputType).addEventListener('change',UICtrl.changedType);
        document.querySelector(DOMstrings.cancelBtn).addEventListener('click',()=>{UICtrl.cancelChange(); UICtrl.clearInputs();});
        document.querySelector(DOMstrings.changeBtn).addEventListener('click',ctrlchangeItem);
    }


return{
    init:function(){
        UICtrl.displayDate();
        seteventListeners();
        displayInitItem();
        updateTotal();
        updatePercentages();
    }
}

})(DataController,UIController);
//Global Scope
controller.init();
