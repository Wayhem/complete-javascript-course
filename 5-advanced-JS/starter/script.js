(function(){
  function Question(question, arrayAns, answer) {
    this.question = question;
    this.arrayAns = arrayAns;
    this.answer = answer;
  }

  function closure(){
    let sc = 0;
    return function(status) {
      if (status) {
        sc++;
      } else {
        return sc;
      }
    }
  }

  Question.prototype.ask = function () {
    console.log(this.question);
    for (let i = 0; i<this.arrayAns.length; i++) {
      console.log(i+': '+ this.arrayAns[i]);
    }
    console.log('Score: ' + score(false));
    this.respond();
  };

  Question.prototype.respond = function () {
    let answer = prompt('Which is the correct answer?');
    if (answer == this.answer) {
      alert('CORRECT!');
      score(true);
      this.redo();
    } else if(answer == 'exit'){
      return;
    }
    else {
      alert('WRONG!');
      this.redo();
    }
  };

  Question.prototype.redo = function() {
    let random = Math.floor(Math.random() * arrayQuestions.length);
    console.clear();
    arrayQuestions[random].ask();
  };

  let arrayQuestions = [];
  let question1 = new Question('Blondes Are?', ["Smart", "Really smart", "Dumb"], 2);
  let question2 = new Question('Beagle is a?', ["Small breed", "Medium breed", "Large breed"], 0);
  let question3 = new Question('Hitler was from?', ["France", "Germany", "Austria"], 2);
  let score = closure();

  arrayQuestions.push(question1);
  arrayQuestions.push(question2);
  arrayQuestions.push(question3);
  let random = Math.floor(Math.random() * arrayQuestions.length);
  arrayQuestions[random].ask();
})();
