document.addEventListener('DOMContentLoaded', function(event) {
    stage = document.getElementById('stage'),
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
    hasCustomers = false,

    //stop making customers if they've all been cleared 
    //TODO - rig up cancelled (and toSort) for B, C and D customer types
    cancelled = false;
    cancelledB = false;
    cancelledC = false;
    cancelledD = false;

    //do customers exist yet?
    customersA = document.querySelector('.customerA');
    customersB = document.querySelector('.customerB');
    customersC = document.querySelector('.customerC');
    customersD = document.querySelector('.customerD');

    //vars for bartender
    bartenderX = 720,
    bartenderY = 670,

    //add check for bartender holding glass
    glass = '',
    hasGlass = false,

    //add the bartender
    addBartender();

    //add a customer every 2sec until 15 customers have been added 
    addCustomers();
    addCustomersB();
    addCustomersC();
    addCustomersD();

    //remove the customers (if they have been served)
    //removeCustomers();

    //create the bartender
    function addBartender() {
        var bartender = document.createElement('div');
        bartender.classList.add('bartender');
        bartender.setAttribute('id', 'bartender');
        //bartender.style.top = bartenderY + 'px';
        //bartender.style.left = bartenderX + 'px';
        stage.appendChild(bartender);
        //bartenderX += 60;
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
    });

    bar2.addEventListener('click', function() {
        moveToBar2();
    });

    bar3.addEventListener('click', function() {
        moveToBar3();
    });

    bar4.addEventListener('click', function() {
        moveToBar4();
    });

    tap1.addEventListener('click', function() {
        addGlass();
    });

    tap2.addEventListener('click', function() {
        addGlass();
    });

    tap3.addEventListener('click', function() {
        addGlass();
    });

    tap4.addEventListener('click', function() {
        addGlass();
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
        if (hasGlass === false) {
            console.log(hasGlass);
            var glass = document.createElement('div');
            glass.setAttribute('id', 'glass');
            bartender.appendChild(glass);
            Hammer(glass).on("swipeleft", function() {
                $(glass).animate({left: "-=600"}, 500)
            });
            //*****TODO check for glass colliding with customer and call new function to animate glass*****
        }
        hasGlass = true;
    }

    //create the customers for the top bar
    function addCustomers() {
        if (cancelled) {
            return;
        }
        setTimeout(function () {
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
        customer.classList.add('customerA');
        customer.classList.add(customerType);
        customer.setAttribute('data-type', customerType)
        //customer.style.top = customerY + 'px';
        customer.style.left = customerX + 'px';
        stage.appendChild(customer);
        //customerX += 60;
        customerType += 1;
        TweenMax.to(customer, 10, {x:250});
        hasCustomers = true;
    }

    function addCustomerIds() {
        var elements = document.getElementsByClassName('customerA');
        console.log(elements);
    }

    //create the customers for the second to top bar
    function addCustomersB() {
        if (cancelledB) {
            return;
        }
        setTimeout(function () {
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
        customerB.classList.add('customerB');
        customerB.classList.add(customerTypeB);
        //customer.style.top = customerY + 'px';
        customerB.style.left = customerX + 'px';
        stage.appendChild(customerB);
        //customerX += 60;
        customerTypeB += 1;
        TweenMax.to(customerB, 10, {x:300});
    }

    //create the customers for the third to top bar
    function addCustomersC() {
        if (cancelledC) {
            return;
        }
        setTimeout(function () {
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
        customerC.classList.add('customerC');
        customerC.classList.add(customerTypeC);
        //customer.style.top = customerY + 'px';
        customerC.style.left = customerX + 'px';
        stage.appendChild(customerC);
        //customerX += 60;
        customerTypeC += 1;
        TweenMax.to(customerC, 10, {x:350});
    }

    //create the customers for the final bar from top
    function addCustomersD() {
        if (cancelledD) {
            return;
        }
        setTimeout(function () {
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
        customerD.classList.add('customerD');
        customerD.classList.add(customerTypeD);
        //customer.style.top = customerY + 'px';
        customerD.style.left = customerX + 'px';
        stage.appendChild(customerD);
        //customerX += 60;
        customerTypeD += 1;
        TweenMax.to(customerD, 10, {x:420});
    }


    //*****TODO check for glass colliding with customer*****
    function collision_() {
        if (arguments.length > 1) {
            for (var x = 0; x < arguments.length; x++) {
                for (var y = 1; y < arguments.length; y++) {
                    if (x == y) {
                        continue;
                    }
                    if (collision(arguments[x], arguments[y])) {
                        return true;
                    }
                }
            }
            return false;
        }
    }

    function collision($div1, $div2) {
        var x1 = $div1.offset().left;
        var y1 = $div1.offset().top;
        var h1 = $div1.outerHeight(true);
        var w1 = $div1.outerWidth(true);
        var b1 = y1 + h1;
        var r1 = x1 + w1;
        var x2 = $div2.offset().left;
        var y2 = $div2.offset().top;
        var h2 = $div2.outerHeight(true);
        var w2 = $div2.outerWidth(true);
        var b2 = y2 + h2;
        var r2 = x2 + w2;
        
        if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
        return true;
    }

    //top bar var updates
    var toSort = [];
    var firstCustomerTopBar;

    //second bar var updates
    var toSortSecondBar = [];
    var firstCustomerSecondBar;

    //third bar var updates
    var toSortThirdBar = [];
    var firstCustomerThirdBar;

    //fourth bar var updates
    var toSortThirdBar = [];
    var firstCustomerThirdBar;


    //top bar collision check
    window.setInterval(function() {
        toSort = Array.prototype.slice.call(document.querySelectorAll('.customerA'));
        firstCustomerTopBar = $('*[data-type="1"]');
        console.log(firstCustomerTopBar);
    }, 50);

    window.setInterval(function() {
        if (hasGlass === true && typeof firstCustomerTopBar !== 'undefined') {
            var theGlass = $('#glass');

            if (toSort.length === 0) {
                console.log('no customers');
                cancelled = true;
            } else if (toSort.length === 1) {
                console.log('only one');
                firstCustomerTopBar = $('*[data-type="1"]');
            }

            if (toSort.length >= 1) {
                //console.log(collision_(theGlass, firstCustomerTopBar));
                if (collision_(theGlass, firstCustomerTopBar) === true) {
                    var elem1 = document.querySelector('#glass');
                    elem1.parentNode.removeChild(elem1);
                    hasGlass = false;
                    //move the customer off the screen
                    TweenMax.to(firstCustomerTopBar, 2, {x:-100});
                    score += 100;
                    scoreContainer.innerText = score;
                    var elem2 = document.querySelector('*[data-type="1"]');
                    //elem2.removeAttribute('data-type');
                    elem2.parentNode.removeChild(elem2);
                }
            }
        } else if (hasGlass === false && customerCounter < 5) {
            if (typeof toSort !== 'undefined' && toSort.length > 0) {
                var found = false;
                var i = 0;
                var counter = 0;
                for(i; i < toSort.length; i++) {
                    if (toSort[i].attributes[1].nodeValue == '1') {
                        found = true;
                        break;
                    } else {
                        //get all customers left on that bar and update data-attr
                        console.log(toSort);
                        counter++;
                        toSort[i].attributes[1].nodeValue = counter;
                    }
                }           
            }   
        }

    }, 50);


});