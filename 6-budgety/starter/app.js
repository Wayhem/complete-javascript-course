var budgetController = (function(){
    
    var Income = function(id, description, amount){
        this.id = id;
        this.description = description;
        this.amount = amount;
    }
    
    var Expense = function(id, description, amount){
        this.id = id;
        this.description = description;
        this.amount = amount;
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }

    return {
        addItem: function(type, des, val) {
            var newItem, ID;
            
            if(data.allItems[type].length){
                ID = (data.allItems[type][data.allItems[type].length-1].id + 1) || 0;
            } else {
                ID = 0;
            }

            if (type === 'exp'){
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            data.allItems[type].push(newItem);
            return newItem;
        }
    }

})();

var UIController = (function(){
    const DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        expenseList: '.expenses__list',
        incomeList: '.income__list'
    }
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value, //inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },

        addListItem: function(obj, type){
            var html, newHtml, element;
            if (type === 'inc'){
                element = document.querySelector(DOMstrings.incomeList);
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            } else if (type === 'exp'){
                element = document.querySelector(DOMstrings.expenseList);
                html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }
            
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.amount);            
            
            element.insertAdjacentHTML('beforeend', newHtml);
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    };

})();

const controller = (function(budgetCtrl, UICtrl){
    var setupEventListeners = function() {
        const DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputButton).addEventListener('click', ctrlAddItem);
        document.addEventListener('keypress', function(e){
            if (e.keyCode === 13 || e.which === 13) {
                ctrlAddItem();
            }
        });
    };

    var ctrlAddItem = function () {
        var input, newItem;
        //get input
        input = UICtrl.getInput();
        //add input to budgetcontroller (data)
        newItem = budgetController.addItem(input.type, input.description, input.value);
        //add item to UIcontroller (ui)
        UICtrl.addListItem(newItem, input.type);
        //calculate budget
        //display budget on ui
    };

    return {
        init: function(){
            console.log('app started');
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();