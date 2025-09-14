document.addEventListener('DOMContentLoaded', function() {
    //create start button
    var startButton = document.getElementById('startButton');

    startButton.addEventListener('click', function() {
        goTapIt();
        startButton.parentNode.removeChild(startButton);
    });
});



function goTapIt(event) {
    stage = document.getElementById('stage'),
    //set score
    score = 0,
    scoreContainer = document.getElementById('score'),
    scoreContainer.innerText=score;

    //vars for bars
    bar1 = document.getElementById('bar1'),
    bar2 = document.getElementById('bar2'),
    bar3 = document.getElementById('bar3'),
    bar4 = document.getElementById('bar4'),

    //vars for taps
    tap1 = document.getElementById('tap1'),
    tap2 = document.getElementById('tap2'),
    tap3 = document.getElementById('tap3'),
    tap4 = document.getElementById('tap4'),

    //vars for customers
    customerType = 1,
    customerTypeB = 1,
    customerTypeC = 1,
    customerTypeD = 1,
    customerX = 200,
    customerY = 0,
    customerCounter = 0,
    customerCounterB = 0,
    customerCounterC = 0,
    customerCounterD = 0,
    topBarCustomersExist = false,
    secondBarCustomersExist = false,
    thirdBarCustomersExist = false,
    fourthBarCustomersExist = false,
    topBarCleared = false,
    secondBarCleared = false,
    thirdBarCleared = false,
    fourthBarCleared = false,
    firstBarCustomerCount = [],
    secondBarCustomerCount = [],
    thirdBarCustomerCount = [],
    fourthBarCustomerCount = [],

    imgCount = 3,
    dir = 'img/',
    images = new Array
        images[1] = "angryDude1.png",
        images[2] = "angryDude2.png",
        images[3] = "angryDude3.png",
        images[4] = "angryLady.png",


    //stop making customers if they've all been cleared 
    cancelled = false;

    //do customers exist yet?
    customersA = document.querySelector('.customerA');
    customersB = document.querySelector('.customerB');
    customersC = document.querySelector('.customerC');
    customersD = document.querySelector('.customerD');

    customerCreationTimer1 = '',
    customerCreationTimer2 = '',
    customerCreationTimer3 = '',
    customerCreationTimer4 = '',

    //vars for bartender
    bartender = '',
    bartenderX = 720,
    bartenderY = 670,
    bartenderExists = document.getElementById('bartender'),

    //add check for bartender holding glass
    glass = '',
    hasGlass = false,
    glassExists = document.getElementById('glass'),

    //what bar is that dude at
    atBarOne = false,
    atBarTwo = false,
    atBarThree = false,
    atBarFour = false,

    //did u win or lose
    win = false,
    lose = false,

    //add the bartender
    addBartender();

    //add a customer every 2sec until 15 customers have been added 
    addCustomers();
    addCustomersB();
    addCustomersC();
    addCustomersD();

    //create the bartender
    function addBartender() {
        var bartender = document.createElement('div');
        bartender.classList.add('bartender');
        bartender.setAttribute('id', 'bartender');
        stage.appendChild(bartender);
        //since he starts off at bar one set it to true
        atBarOne = true;
    }

    //create the closing screen
    function addClosingScreen() {
        if (win === true) {
            var winMessage = 'You won! You must be pretty good at pouring (root)beers.';
        }

        if (lose === true) {
            var winMessage = 'Sorry, try again next time! You must like LaCroix.';
        }

        var closingScreen = document.createElement('div');
        var someWords = document.createElement('p');
        var replayButton = document.createElement('button');
        var buttonMessage = 'play again';
        replayButton.setAttribute('id', 'replay');
        someWords.setAttribute('id', 'win-or-lose-message');
        closingScreen.setAttribute('id', 'closingscreen');
        replayButton.innerText=buttonMessage;
        someWords.innerText=winMessage;
        stage.appendChild(closingScreen);
        closingScreen.appendChild(someWords);
        closingScreen.appendChild(replayButton);

        replayButton.addEventListener('click', function() {
            moveToBar1();
            //replayTheGame
            goTapIt();
            closingscreen.parentNode.removeChild(closingscreen);
        });
    }

    var bartender = document.getElementById('bartender');

    //animate the bartender to the clicked tap
    //make a new timeline
    var tl = new TimelineMax({paused:true});

    tl.to(bartender, 0.4, {top:430, left:615, ease:Linear.easeNone}, "bar1")
        .to(bartender, 0.4, {top:280, left:565, ease:Linear.easeNone}, "bar2")
        .to(bartender, 0.4, {top:130, left:515, ease:Linear.easeNone}, "bar3")
        .add("bar4")

    bar1.addEventListener('click', function() {
        moveToBar1();
        atBarOne = true;
    });

    bar2.addEventListener('click', function() {
        moveToBar2();
        atBarTwo = true;
    });

    bar3.addEventListener('click', function() {
        moveToBar3();
        atBarThree = true;
    });

    bar4.addEventListener('click', function() {
        moveToBar4();
        atBarFour = true;
    });

    tap1.addEventListener('click', function() {
        if (fourthBarCustomersExist && atBarOne && hasGlass === false) {
            console.log(hasGlass, atBarOne);
            addGlass();
        }
    });

    tap2.addEventListener('click', function() {
        if (thirdBarCustomersExist && atBarTwo && hasGlass === false) {
            console.log(hasGlass, atBarTwo);
            addGlass();
        }
    });

    tap3.addEventListener('click', function() {
        if(secondBarCustomersExist && atBarThree && hasGlass === false) {
            console.log(hasGlass, atBarThree);
            addGlass();
        }
    });

    tap4.addEventListener('click', function() {
        if(topBarCustomersExist && atBarFour && hasGlass === false) {
            console.log(hasGlass, atBarFour);
            addGlass();
        }
    });

    function moveToBar1() {
        tl.tweenTo('bar1');
    }

    function moveToBar2() {
        tl.tweenTo('bar2', {ease:Back.easeOut});
    }

    function moveToBar3() {
        tl.tweenTo('bar3', {ease:Back.easeOut});
    }

    function moveToBar4() {
        tl.tweenTo('bar4', {ease:Back.easeOut});
    }

    //generate the beer glass
    function addGlass() {
        console.log('im trying to add a glass');
        if (hasGlass === false && topBarCustomersExist || secondBarCustomersExist || thirdBarCustomersExist || fourthBarCustomersExist) {
            var glass = document.createElement('div');
            bartender = document.getElementById('bartender');
            glass.setAttribute('id', 'glass');
            bartender.appendChild(glass);
            console.log('i succeeded in adding a glass');
            Hammer(glass).on("swipeleft", function() {
                $(glass).animate({left: "-=600"}, 500)
                onGlassSwipe();
            });
        }
        hasGlass = true;
    }

    //create the customers for the top bar
    function addCustomers() {
        if (cancelled) {
            return;
        }
        customerCreationTimer1 = setTimeout(function () {
            if (customerCounter < 5) {
                createCustomer();
                customerCounter++;
                addCustomers();
            }
        //make the min and max range higher for the shortest bar
        }, Math.round(Math.random() * (10000 - 4000) + 4000));
    }

    function createCustomer() {
        var customer = document.createElement('div');
        customer.setAttribute('id', 'a' + customerType);
        customer.classList.add('customerA');
        customer.classList.add(customerType);
        customer.setAttribute('data-type', customerType)
        //customer.style.top = customerY + 'px';
        customer.style.left = customerX + 'px';
        stage.appendChild(customer);
        var randomCount = Math.round(Math.random() * (imgCount - 1)) + 1;
        customer.style.backgroundImage = "url(" + dir + images[randomCount] + ")";
        //customerX += 60;
        customerType += 1;
        TweenMax.to(customer, 10, {x:250});
        topBarCustomersExist = true;
    }

    function addCustomerIds() {
        var elements = document.getElementsByClassName('customerA');
    }

    //create the customers for the second to top bar
    function addCustomersB() {
        customerCreationTimer2 = setTimeout(function () {
            if (customerCounterB < 5) {
                createCustomerB();
                customerCounterB++;
                addCustomersB();
            }
        //make the min and max range higher for the shortest bar
        }, Math.round(Math.random() * (9000 - 3000) + 3000));
    }

    function createCustomerB() {
        var customerB = document.createElement('div');
        customerB.setAttribute('id', 'b' + customerTypeB);
        customerB.classList.add('customerB');
        customerB.classList.add(customerTypeB);
        //customer.style.top = customerY + 'px';
        customerB.style.left = customerX + 'px';
        stage.appendChild(customerB);
        var randomCount = Math.round(Math.random() * (imgCount - 1)) + 1;
        customerB.style.backgroundImage = "url(" + dir + images[randomCount] + ")";
        //customerX += 60;
        customerTypeB += 1;
        TweenMax.to(customerB, 10, {x:300});
        secondBarCustomersExist = true;
    }

    //create the customers for the third to top bar
    function addCustomersC() {
        customerCreationTimer3 = setTimeout(function () {
            if (customerCounterC < 5) {
                createCustomerC();
                customerCounterC++;
                addCustomersC();
            }
        //make the min and max range higher for the shortest bar
        }, Math.round(Math.random() * (8000 - 2000) + 2000));
    }

    function createCustomerC() {
        var customerC = document.createElement('div');
        customerC.setAttribute('id', 'c' + customerTypeC);
        customerC.classList.add('customerC');
        customerC.classList.add(customerTypeC);
        //customer.style.top = customerY + 'px';
        customerC.style.left = customerX + 'px';
        stage.appendChild(customerC);
        var randomCount = Math.round(Math.random() * (imgCount - 1)) + 1;
        customerC.style.backgroundImage = "url(" + dir + images[randomCount] + ")";
        //customerX += 60;
        customerTypeC += 1;
        TweenMax.to(customerC, 10, {x:350});
        thirdBarCustomersExist = true;
    }

    //create the customers for the final bar from top
    function addCustomersD() {
        customerCreationTimer4 = setTimeout(function () {
            if (customerCounterD < 5) {
                createCustomerD();
                customerCounterD++;
                addCustomersD();
            }
        //make the min and max range higher for the shortest bar
        }, Math.round(Math.random() * (6000 - 2000) + 2000));
    }

    function createCustomerD() {
        var customerD = document.createElement('div');
        customerD.setAttribute('id', 'd' + customerTypeD);
        customerD.classList.add('customerD');
        customerD.classList.add(customerTypeD);
        //customer.style.top = customerY + 'px';
        customerD.style.left = customerX + 'px';
        stage.appendChild(customerD);
        var randomCount = Math.round(Math.random() * (imgCount - 1)) + 1;
        customerD.style.backgroundImage = "url(" + dir + images[randomCount] + ")";
        //customerX += 60;
        customerTypeD += 1;
        TweenMax.to(customerD, 10, {x:420});
        fourthBarCustomersExist = true;
    }

    function removeBartender() {
        firstBarCustomerCount = [];
        secondBarCustomerCount = [];
        thirdBarCustomerCount = [];
        fourthBarCustomerCount = [];

        bartender.parentNode.removeChild(bartender);

        var customers1 = document.getElementsByClassName('customerA');
        var customers2 = document.getElementsByClassName('customerB');
        var customers3 = document.getElementsByClassName('customerC');
        var customers4 = document.getElementsByClassName('customerD');
        
        if (customers1 || customers2 || customers3 || customers4) {
            removeCustomers();
            hasGlass = false;
        }

        addClosingScreen();
    }

    function removeCustomers(){
        clearTimeout(customerCreationTimer1);
        clearTimeout(customerCreationTimer2);
        clearTimeout(customerCreationTimer3);
        clearTimeout(customerCreationTimer4);
        customerCounter = 0;
        customerCounterB = 0;
        customerCounterC = 0;
        customerCounterD = 0;

        var customers1 = document.getElementsByClassName('customerA');
        var customers2 = document.getElementsByClassName('customerB');
        var customers3 = document.getElementsByClassName('customerC');
        var customers4 = document.getElementsByClassName('customerD');

        while(customers1.length > 0){
            customers1[0].parentNode.removeChild(customers1[0]);
        }
        while(customers2.length > 0){
            customers2[0].parentNode.removeChild(customers2[0]);
        }
        while(customers3.length > 0){
            customers3[0].parentNode.removeChild(customers3[0]);
        }
        while(customers4.length > 0){
            customers4[0].parentNode.removeChild(customers4[0]);
        }
    }

    //count how many customers are left on the screen and update arrays to make sure first customer always has appropriate ID for collision detcetion
    var checkCustomerCounts = window.setInterval(function () {
        console.log(topBarCustomersExist, secondBarCustomersExist, thirdBarCustomersExist, fourthBarCustomersExist);
        firstBarCustomerCount = Array.prototype.slice.call(document.querySelectorAll('.customerA'));
        secondBarCustomerCount = Array.prototype.slice.call(document.querySelectorAll('.customerB'));
        thirdBarCustomerCount = Array.prototype.slice.call(document.querySelectorAll('.customerC'));
        fourthBarCustomerCount = Array.prototype.slice.call(document.querySelectorAll('.customerD'));
        console.log(firstBarCustomerCount.length, secondBarCustomerCount.length, thirdBarCustomerCount.length, fourthBarCustomerCount.length);

        var firstCustomerFirstBar = firstBarCustomerCount.some(function(element) {
            return element.id == 'a1';
        });
        if (!firstCustomerFirstBar) {
            if (firstBarCustomerCount.length > 0) {
                firstBarCustomerCount[0].id = 'a1';
            }
        } else if (topBarCustomersExist) {
            //watch position incase it hits end of bar
            var firstCustomer = document.getElementById('a1');
            var rect1 = firstCustomer.getBoundingClientRect();
            firstCustomerPosition = rect1.left;
            if (firstCustomerPosition === 450) {
                customerCounter = 6;
                topBarCustomersExist = false;
                lose = true;
                removeBartender();
                clearInterval(checkCustomerCounts);
            }
        }

        var firstCustomerSecondBar = secondBarCustomerCount.some(function(element) {
            return element.id == 'b1';
        });
        if (!firstCustomerSecondBar) {
            if (secondBarCustomerCount.length > 0) {
                secondBarCustomerCount[0].id = 'b1';
            }
        } else if (secondBarCustomersExist) {
            //watch position incase it hits end of bar
            var secondCustomer = document.getElementById('b1');
            var rect2 = secondCustomer.getBoundingClientRect();
            secondCustomerPosition = rect2.left;
            if (secondCustomerPosition === 500) {
                customerCounterB = 6;
                secondBarCustomersExist = false;
                lose = true;
                removeBartender();
                clearInterval(checkCustomerCounts);
            }
        }

        var firstCustomerThirdBar = thirdBarCustomerCount.some(function(element) {
            return element.id == 'c1';
        });
        if (!firstCustomerThirdBar) {
            if (thirdBarCustomerCount.length > 0) {
                thirdBarCustomerCount[0].id = 'c1';
            }
        } else if (thirdBarCustomersExist) {
            //watch position incase it hits end of bar
            var thirdCustomer = document.getElementById('c1');
            var rect3 = thirdCustomer.getBoundingClientRect();
            thirdCustomerPosition = rect3.left;
            if (thirdCustomerPosition === 550) {
                customerCounterC = 6;
                thirdBarCustomersExist = false;
                lose = true;
                removeBartender();
                clearInterval(checkCustomerCounts);
            }
        }

        var firstCustomerFourthBar = fourthBarCustomerCount.some(function(element) {
            return element.id == 'd1';
        });
        if (!firstCustomerFourthBar) {
            if (fourthBarCustomerCount.length > 0) {
                fourthBarCustomerCount[0].id = 'd1';
            }
        } else if (fourthBarCustomersExist) {
            //watch position incase it hits end of bar
            var fourthCustomer = document.getElementById('d1');
            var rect4 = fourthCustomer.getBoundingClientRect();
            fourthCustomerPosition = rect4.left;
            if (fourthCustomerPosition === 620) {
                customerCounterD = 6;
                fourthBarCustomersExist = false;
                lose = true;
                removeBartender();
                clearInterval(checkCustomerCounts);
            }
        }

        //U won
        if (topBarCleared && secondBarCleared && thirdBarCleared && fourthBarCleared) {
            win = true;
            clearInterval(checkCustomerCounts);
            customerCounter = 0;
            removeBartender();
            //STOP MAKING CUSTOMERS AND ADD PLAY AGAIN BUTTON
            return;
        }
    }, 100);

    function onGlassSwipe() {
        //record position of glass
        var intervalId = window.setInterval(function () {
            //get glass
            var selElem = document.getElementById('glass');
            //get glass location
            var glassLocation = selElem.getBoundingClientRect();

            if (topBarCustomersExist === true) {
                var topBarCustomer = document.getElementById('a1');
                //get customer location
                var rect2 = topBarCustomer.getBoundingClientRect();
                //catch overlap for bar 1
                var overlap = !(glassLocation.right < rect2.left || 
                glassLocation.left > rect2.right || 
                glassLocation.bottom < rect2.top || 
                glassLocation.top > rect2.bottom);
                if (overlap === true) {
                    score += 100;
                    scoreContainer.innerText = score;
                    window.clearInterval(intervalId);
                    //remove the first customer (check id) and reset id of second customers IF there is more than one customer, otherwise just stop creating new customers since the bar has been cleared
                    topBarCustomer.parentNode.removeChild(topBarCustomer);
                    if (firstBarCustomerCount.length === 1) {
                        //sloppy, but knock the coutner out of range so no new customers are created
                        topBarCustomersExist = false;
                        topBarCleared = true;
                        clearTimeout(customerCreationTimer1);
                        customerCounter = 0;
                        firstBarCustomerCount = [];
                    }
                }
            }

            if (secondBarCustomersExist === true) {
                var secondBarCustomer = document.getElementById('b1');
                //get customer location
                var rect2b = secondBarCustomer.getBoundingClientRect();
                //catch overlap for bar 2
                var overlap2 = !(glassLocation.right < rect2b.left || 
                glassLocation.left > rect2b.right || 
                glassLocation.bottom < rect2b.top || 
                glassLocation.top > rect2b.bottom);
                if (overlap2 === true) {
                    score += 100;
                    scoreContainer.innerText = score;
                    window.clearInterval(intervalId);
                    //remove the first customer (check id) and reset id of second customers IF there is more than one customer, otherwise just stop creating new customers since the bar has been cleared
                    secondBarCustomer.parentNode.removeChild(secondBarCustomer);
                    if (secondBarCustomerCount.length === 1) {
                        //sloppy, but knock the coutner out of range so no new customers are created
                        secondBarCustomersExist = false;
                        secondBarCleared = true;
                        clearTimeout(customerCreationTimer2);
                        customerCounterB = 0;
                        secondBarCustomerCount = [];
                    }
                }
            }

            if (thirdBarCustomersExist === true) {
                var thirdBarCustomer = document.getElementById('c1');
                //get customer location
                var rect2c = thirdBarCustomer.getBoundingClientRect();
                //catch overlap for bar 3
                var overlap3 = !(glassLocation.right < rect2c.left || 
                glassLocation.left > rect2c.right || 
                glassLocation.bottom < rect2c.top || 
                glassLocation.top > rect2c.bottom);
                if (overlap3 === true) {
                    score += 100;
                    scoreContainer.innerText = score;
                    window.clearInterval(intervalId);
                    //remove the first customer (check id) and reset id of second customers IF there is more than one customer, otherwise just stop creating new customers since the bar has been cleared
                    thirdBarCustomer.parentNode.removeChild(thirdBarCustomer);
                    if (thirdBarCustomerCount.length === 1) {
                        //sloppy, but knock the coutner out of range so no new customers are created
                        thirdBarCustomersExist = false;
                        thirdBarCleared = true;
                        clearTimeout(customerCreationTimer3);
                        customerCounterC = 0;
                        thirdBarCustomerCount = [];
                    }
                }
            }

            if (fourthBarCustomersExist === true) {
                var fourthBarCustomer = document.getElementById('d1');
                //get customer location
                var rect2d = fourthBarCustomer.getBoundingClientRect();
                //catch overlap for bar 4
                var overlap4 = !(glassLocation.right < rect2d.left || 
                glassLocation.left > rect2d.right || 
                glassLocation.bottom < rect2d.top || 
                glassLocation.top > rect2d.bottom);

                if (overlap4 === true) {
                    score += 100;
                    scoreContainer.innerText = score;
                    window.clearInterval(intervalId);
                    //remove the first customer (check id) and reset id of second customers IF there is more than one customer, otherwise just stop creating new customers since the bar has been cleared
                    fourthBarCustomer.parentNode.removeChild(fourthBarCustomer);
                    if (fourthBarCustomerCount.length === 1) {
                        //sloppy, but knock the coutner out of range so no new cuastomers are created
                        fourthBarCustomersExist = false;
                        fourthBarCleared = true;
                        clearTimeout(customerCreationTimer4);
                        customerCounterD = 0;
                        fourthBarCustomerCount = [];
                    }
                }
            }

            if (overlap === true || overlap2 === true || overlap3 === true || overlap4 === true) {
                var glass = document.querySelector('#glass');
                    hasGlass = false;
                    glass.parentNode.removeChild(glass);
            }
        }, 30);
    }
}
