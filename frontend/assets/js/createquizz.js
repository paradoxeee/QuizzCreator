document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = '/login.html';
    }
});

document.getElementById('titlequizz').addEventListener('input', function () {
    var submitBtn = document.getElementById('continue');
    var input = document.getElementById('titlequizz');
    input.style.fontFamily = "Agrandir GrandHeavy";
    if (this.value.length > 0) { 
        submitBtn.style.display = 'block';
        setTimeout(function () {
            submitBtn.style.opacity = 1;
        }, 10); 
    } else {
        submitBtn.style.opacity = 0; 
        setTimeout(function () {
            submitBtn.style.display = 'none'; 
        }, 500); 
    }
});

document.getElementById('titlequestion').addEventListener('input', function() {
    var input = document.getElementById('titlequestion');
    input.style.fontFamily = "Agrandir GrandHeavy";
})

document.getElementById('titlequestiontof').addEventListener('input', function () {
    var input = document.getElementById('titlequestiontof');
    input.style.fontFamily = "Agrandir GrandHeavy";
})

document.addEventListener('DOMContentLoaded', function () {
    const quizzForm = document.getElementById('quizztitle');
    var header = document.querySelector('.title');
    quizzForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const title = document.getElementById('titlequizz').value;
        const description = document.getElementById('descriptionquizz').value;
        const username = localStorage.getItem('username'); 
        const formData = { title, description, username };
        fetch('http://localhost:5502/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => {
                if (data.message) {
                    console.log('Quizz créé avec succès');
                    localStorage.setItem('currentQuizId', data.quizId);
                    const container = document.getElementById('container');
                    container.style.transition = 'transform 0.5s ease-in-out';
                    container.style.transform = 'translateX(100%)';
                    setTimeout(() => {
                        quizzForm.style.display = 'none';
                        header.style.display = 'none';
                        const newSection = document.querySelector('.newSection');
                        newSection.style.display = 'flex';
                    }, 500);
                } else {
                    console.error('Erreur de création du quizz');
                }
            })
            .catch(error => console.error('Error during quizz creation:', error));
    });
});



document.querySelectorAll('.typebtn').forEach(function (btn) {
    btn.addEventListener('click', function () {
        const wasClicked = this.classList.contains('clicked');

        
        document.querySelectorAll('.typebtn').forEach(button => button.classList.remove('clicked'));

        
        if (!wasClicked) {
            this.classList.add('clicked');
        }

        var isAnyButtonClicked = document.querySelector('.typebtn.clicked') !== null;
        var submitBtn = document.getElementById('suite'); 
        var header = document.querySelector('.suite');

        if (isAnyButtonClicked) {
            submitBtn.style.display = 'block';
            header.style.display = 'block';
            setTimeout(function () {
                submitBtn.style.opacity = 1;
                header.style.opacity = 1;
            }, 10);
        } else {
            submitBtn.style.opacity = 0;
            header.style.opacity = 0;
            setTimeout(function () {
                submitBtn.style.display = 'none';
                header.style.display = 'none';
            }, 500);
        }
    });
});


document.addEventListener('DOMContentLoaded', function () {
    const suiteBtn = document.getElementById('suite');

    
    suiteBtn.addEventListener('click', function () {
    
        const clickedBtn = document.querySelector('.typebtn.clicked');

        if (clickedBtn) {
            const btnId = clickedBtn.id; 

            const newSection = document.querySelector('.newSection');
            newSection.style.display = 'none';

            switch (btnId) {
                case 'mc':
                    document.querySelector('.multiplechoice').style.display = 'block';
                    break;
                case 'tof':
                    document.querySelector('.trueorfalse').style.display = 'block';
                    break;
                case 'sa':
                    document.querySelector('.shortanswer').style.display = 'block';
                    break;
            }
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const addChoiceBtn = document.getElementById('addChoice');
    addChoiceBtn.addEventListener('click', addChoiceInput);

    function addChoiceInput() {
        const container = document.getElementById('choicesContainer');
        const totalInputs = container.querySelectorAll('.inputquestion').length;
        const checkboxInputs = container.querySelectorAll('.checkboxinput').length;

        if (totalInputs < 4 && checkboxInputs < 4) {
            const alignDiv = document.createElement('div');
            alignDiv.className = 'align';

            const newInputText = document.createElement('input');
            newInputText.type = 'text';
            newInputText.className = 'inputquestion';
            newInputText.dataset.type = 'choice';
            newInputText.placeholder = `Option ${totalInputs + 1}`;
            alignDiv.appendChild(newInputText);

            const label = document.createElement('label');
            label.className = 'containerbox';

            const newInputCheckbox = document.createElement('input');
            newInputCheckbox.type = 'checkbox';
            newInputCheckbox.className = 'checkboxinput';
            newInputCheckbox.dataset.type = 'choice';
            label.appendChild(newInputCheckbox);

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('viewBox', '0 0 64 64');
            svg.setAttribute('height', '2em');
            svg.setAttribute('width', '2em');

            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', 'M 0 16 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 16 L 32 48 L 64 16 V 8 A 8 8 90 0 0 56 0 H 8 A 8 8 90 0 0 0 8 V 56 A 8 8 90 0 0 8 64 H 56 A 8 8 90 0 0 64 56 V 16');
            path.setAttribute('class', 'path');
            svg.appendChild(path);
            label.appendChild(svg);

            alignDiv.appendChild(label);
            container.appendChild(alignDiv);

            if (totalInputs === 0) { 
                addDeleteButton();
            }
        } else {
            alert('Vous pouvez ajouter jusqu\'à 4 options uniquement.');
        }
    }

    function addDeleteButton() {
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Supprimer une option';
        deleteBtn.type = 'button';
        deleteBtn.id = 'deleteChoice';
        document.getElementById('multiple').appendChild(deleteBtn);

        deleteBtn.addEventListener('click', function () {
            const alignDivs = document.querySelectorAll('#choicesContainer .align');

            if (alignDivs.length > 0) {
                alignDivs[alignDivs.length - 1].remove(); 
                if (alignDivs.length === 1) {
                    deleteBtn.remove(); 
                }
            }
        });
    }
});


document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = '/login.html';
    }
    const questionForm = document.getElementById('multiple'); 

    questionForm.addEventListener('submit', function (event) {
        event.preventDefault(); 

        const title = document.getElementById('titlequestion').value;
        const optionsElements = document.querySelectorAll('.inputquestion');
        const correctAnswersCheckboxes = document.querySelectorAll('.checkboxinput'); 
        const quizId = localStorage.getItem('currentQuizId'); 
        let options = Array.from(optionsElements).map((input, index) => ({
            text: input.value,
            isCorrect: correctAnswersCheckboxes[index].checked 
        }));

        if (!title || options.some(option => !option.text)) {
            alert('Veuillez remplir le titre et au moins une option.');
            return;
        }
        const questionData = {
            title, 
            quizId,
            options 
        };

        fetch('http://localhost:5502/submit-question', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(questionData)
        })
            .then(response => response.json())
            .then(data => {
                const questionId = data.questionId; 
                options.forEach(option => {
                    const optionData = {
                        questionId,
                        text: option.text,
                        isCorrect: option.isCorrect
                    };
                    console.log(optionData)
                    
                    fetch('http://localhost:5502/submit-reponse-multiple', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify(optionData)
                    })
                        .then(res => res.json())
                        .then(optionData => {
                            console.log('Option enregistrée avec succès', optionData);
                        })
                        .catch(error => {
                            console.error('Erreur lors de l\'enregistrement de l\'option:', error);
                        });
                });

                const multiplechoice = document.querySelector('.multiplechoice');
                multiplechoice.style.transition = 'transform 0.5s ease-in-out';
                multiplechoice.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    questionForm.style.display = 'none';
                    const newSection = document.querySelector('.newSection');
                    newSection.style.display = 'flex';
                }, 500); 
                console.log('Question enregistrée avec succès', data);
            })
            .catch(error => {
                console.error('Erreur lors de l\'enregistrement de la question:', error);
                alert(error.message);
            });
    });
});


document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = '/login.html';
    }
    const questionForm = document.getElementById('titletof');

    questionForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const title = document.getElementById('titlequestiontof').value;
        const trueOption = document.getElementById('true-option').checked;
        const falseOption = document.getElementById('false-option').checked;
        const quizId = localStorage.getItem('currentQuizId');

        if (!title || (!trueOption && !falseOption)) {
            alert('Veuillez remplir le titre et sélectionner une option.');
            return;
        }

        const isCorrect = trueOption ? true : false; 

        const questionData = {
            title,
            isTrue: trueOption,
            isFalse: falseOption,
            quizId
        };

        fetch('http://localhost:5502/submit-question-tof', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(questionData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Une erreur est survenue lors de l\'enregistrement de la question.');
                }
                return response.json();
            })
            .then(data => {
                console.log('Question créée avec succès', data);
                localStorage.setItem('currentQuestionId', data.questionId); 

                const questionId = data.questionId; 
                const text = title; 

                const answerData = {
                    questionId,
                    text,
                    isCorrect 
                };
                console.log(questionId)
                console.log(text)
                console.log(isCorrect)
                return fetch('http://localhost:5502/submit-reponse', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(answerData)
                });
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Une erreur est survenue lors de l\'enregistrement de la réponse.');
                }
                return response.json();
            })
            .then(data => {
                console.log('Réponse enregistrée avec succès', data);
                const trueorfalse = document.querySelector('.trueorfalse');
                trueorfalse.style.transition = 'transform 0.5s ease-in-out';
                trueorfalse.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    questionForm.style.display = 'none';
                    const newSection = document.querySelector('.newSection');
                    newSection.style.display = 'flex';
                }, 500); 
            })
            .catch(error => {
                console.error('Erreur lors de l\'enregistrement de la question et de la réponse:', error);
                alert(error.message);
            });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = '/login.html';
    }
    const shortAnswerForm = document.getElementById('formshortanswer');

    shortAnswerForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const title = document.getElementById('titleshort').value;
        const answerElement = document.querySelector('.inputquestionshort');
        const isCorrect1 = answerElement ? answerElement.value : null;

        if (!isCorrect1) {
            console.error('L\'élément de réponse n\'a pas été trouvé.');
            alert('L\'élément de réponse n\'a pas été trouvé.');
            return;
        }

        const quizId = localStorage.getItem('currentQuizId');

        if (!title || !isCorrect1) {
            alert('Veuillez remplir le titre et la réponse.');
            return;
        }

        const questionData = {
            title,
            isCorrect1,
            quizId
        };
        console.log(title)
        console.log(isCorrect1)
        console.log(quizId)
        fetch('http://localhost:5502/submit-short-answer-question', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(questionData)
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.message);
                    });
                }
                return response.json();
            })

            .then(data => {
                console.log('Question créée avec succès', data);
                localStorage.setItem('currentQuestionId', data.questionId);

                const questionId = data.questionId;
                const text = title;
                const answerData = {
                    questionId,
                    text,
                    isCorrect1   
                };
                return fetch('http://localhost:5502/submit-reponse-short', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(answerData)
                });
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(errorData => {
                        throw new Error(errorData.message);
                    });
                }
                return response.json(); 
            })

            .then(data => {
                console.log('Réponse enregistrée avec succès', data);
                const shortanswer = document.querySelector('.shortanswer');
                shortanswer.style.transition = 'transform 0.5s ease-in-out';
                shortanswer.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    questionForm.style.display = 'none';
                    const newSection = document.querySelector('.newSection');
                    newSection.style.display = 'flex';
                }, 500);
            })
            .catch(error => {
                console.error('Erreur lors de l\'enregistrement de la question et de la réponse:', error);
                alert('Une erreur est survenue. Veuillez réessayer.');
            });
    });
});
