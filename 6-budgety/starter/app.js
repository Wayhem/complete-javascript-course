var budgetController = (function(){
    


})();

var UIController = (function(){

    return {
        getInput: function(){
            return {
                type: document.querySelector('.add__type').value, //inc or exp
                description: document.querySelector('.add__description').value,
                value: document.querySelector('.add__value').value
            };
        }
    };

})();

const controller = (function(budgetCtrl, UICtrl){
    var ctrlAddItem = function () {
        //get input
        var input = UICtrl.getInput();
        console.log(input);
        //add input to budgetcontroller (data)
        //add item to UIcontroller (ui)
        //calculate budget
        //display budget on ui
    }

    document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

    document.addEventListener('keypress', function(e){
        if (e.keyCode === 13 || e.which === 13) {
            ctrlAddItem();
        }
    });

})(budgetController, UIController);