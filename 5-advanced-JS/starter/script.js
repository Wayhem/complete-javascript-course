function Question(question, arrayAns, answer) {
  this.question = question;
  this.arrayAns = arrayAns;
  this.answer = answer;
}

let arrayQuestions = [];
let question1 = new Question('Blondes Are?', ["Smart", "Really smart", "Dumb"], 2);
let question2 = new Question('Beagle is a?', ["Small breed", "Medium breed", "Large breed"], 0);
let question3 = new Question('Hitler was from?', ["France", "Germany", "Austria"], 2);

arrayQuestions.push(question1);
arrayQuestions.push(question2);
arrayQuestions.push(question3);

console.log(arrayQuestions);
