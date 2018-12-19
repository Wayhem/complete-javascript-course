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
            data.totals[type] += val;
            return newItem;
        },
        calcBudget: function() {
            return data.totals.inc - data.totals.exp;
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
        incomeList: '.income__list',
        budgetDisplay: '.budget__value'
    }
    return {
        getInput: function(){
            return {
                type: document.querySelector(DOMstrings.inputType).value, //inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
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

        clearFields: function () {
            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription+', '+DOMstrings.inputValue);
            
            fieldsArr = Array.prototype.slice.call(fields);
            
            fieldsArr.forEach(function(field){
                field.value = '';
            });

            fieldsArr[0].focus();
        },

        displayBudget: function(bud){
            document.querySelector(DOMstrings.budgetDisplay).textContent = bud;
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

    var updateBudget = function () {
        var budget;
        //calculate budget
        budget = budgetController.calcBudget();
        //display budget on ui
        UICtrl.displayBudget(budget);
    };

    var ctrlAddItem = function () {
        var input, newItem;
        //get input
        input = UICtrl.getInput();
        if (input.description !== '' && !isNaN(input.value) && input.value > 0){
            //add input to budgetcontroller (data)
            newItem = budgetController.addItem(input.type, input.description, input.value);
            //add item to UIcontroller (ui)
            UICtrl.addListItem(newItem, input.type);
            //clear fields
            UICtrl.clearFields();
            //update budget
            updateBudget();
        }
    };

    return {
        init: function(){
            console.log('app started');
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();