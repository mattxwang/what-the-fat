var questions = [
    {title: "", image: "img/img1.jpg", body: "hey1", answer: "hi"},
    {title: "title2", image: "img/img2.jpg", body: "hey2", answer: "hey"},
    {title: "title3", image: "img/img3.jpg", body: "hey3", answer: "whatsup"},
    {title: "title4", image: "img/img4.jpg", body: "hey4", answer: "howdy"},
    {title: "title5", image: "img/img5.jpg", body: "hey1", answer: "hi"},
    {title: "title6", image: "img/img6.jpg", body: "hey2", answer: "hey"},
    {title: "title7", image: "img/img7.jpg", body: "hey3", answer: "whatsup"},
    {title: "title8", image: "img/img8.jpg", body: "hey4", answer: "howdy"},
    {title: "title9", image: "img/img9.jpg", body: "hey1", answer: "hi"},
    {title: "title10", image: "img/img10.jpg", body: "hey2", answer: "hey"},
    {title: "title11", image: "img/img11.jpg", body: "hey3", answer: "whatsup"},
    {title: "title12", image: "img/img12.jpg", body: "hey4", answer: "howdy"},
    {title: "title13", image: "img/img13.jpg", body: "hey2", answer: "hey"},
    {title: "title14", image: "img/img14.jpg", body: "hey3", answer: "whatsup"},
    {title: "title15", image: "img/img15.jpg", body: "hey4", answer: "howdy"},
]

var numQ = -1;

function nextQ() {
    var response = document.getElementById("questionRes");
    
    if (numQ === -1 || response.value === questions[numQ].answer)
    {
        var form = document.getElementById("responseForm");
        form.hidden = false;

        numQ = numQ + 1;

        if (numQ >= questions.length){
            alert("Done with all questions!");
            return(1);
        }

        var title = document.getElementById("questionTitle");
        var img = document.getElementById("questionImg");
        var body = document.getElementById("questionBody");

        title.innerHTML = questions[numQ].title;
        img.src = questions[numQ].image;
        body.innerHTML = questions[numQ].body;
        response.value = "";
    }
    else {
        alert("Sorry :( wrong answer");
    }
}

function hidden() {
    if (numQ < 0){
        return "true";
    }
    else {
        return "false";
    }
}