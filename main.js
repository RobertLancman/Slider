"use strict"

class Slider {
    constructor(elemSelector, opts, imgFolder) {
        this.currentSlide = 0; //current slide
        this.sliderSelector = elemSelector; //the selector of the element that will be turned into a slider
        this.elem = null; //here we download the element which we will change into a slider
        this.slider = null; //here we generate the slider
        this.slides = null; //Download the slides here
        this.prev = null; // prev button
        this.next = null; // next button
        this.dots = []; //dots buttons
        this.time = null;
        this.imageFolder =imgFolder;

        const defaultOpts = {
            pauseTime : 0,
            prevText : "Poprzedni slide",
            nextText : "Następny slide"
        };
        this.options = Object.assign({}, defaultOpts, opts);
        console.log(this.options.pauseTime);

        this.generateSlider();
        this.changeSlide(this.currentSlide);

    }


    generateSlider() {
        //get the element that you want to turn into a slider
        this.slider = document.querySelector(this.sliderSelector);
        this.slider.classList.add("slider");

        //we create a container for the slides
        const slidesCnt = document.createElement("div");
        slidesCnt.classList.add("slider-slides-cnt");

        // slidesCnt.style.backgroundImage = `url(./img/1.jpg)`

        //Download the slide element
        this.slides = this.slider.children;

    

        //this is a live collection, so as you move each slide
        //its length decreases
        while (this.slides.length) {
            this.slides[0].classList.add("slider-slide");
            //if an element is added to another element
            //it's like removing it from this collection
            //because one element cannot be in two places at the same time


            slidesCnt.append(this.slides[0]);
        }

        //must re-download the slides because the above collection is already empty
        this.slides = slidesCnt.querySelectorAll(".slider-slide");

        this.slides.forEach((el, i) => {
            el.style.backgroundImage= `url(./img${this.imageFolder}/${i+1}.jpg)`;
            el.style.backgroundSize = "cover"
        });


        //we generated a container with slides, so we insert it into the slider
        this.slider.append(slidesCnt);

        if (this.options.generatePrevNext) this.createPrevNext();
        if (this.options.generateDots) this.createPagination();



        this.createPrevNext();
        this.createPagination();
    }

    createPrevNext() {
        //generate button "prev slide"
        this.prev = document.createElement("button");
        this.prev.type = "button";
        this.prev.innerText = this.options.prevText;
        // this.prev.innerText = "Poprzedni slide";
        this.prev.classList.add("slider-button");
        this.prev.classList.add("slider-button-prev");
        this.prev.addEventListener("click", () => this.slidePrev());

        //generate button "next slide"
        this.next = document.createElement("button");
        this.next.type = "button";
        this.next.innerText = this.options.nextText;
        // this.next.innerText = "Następny slide";
        this.next.classList.add("slider-button");
        this.next.classList.add("slider-button-next");
        this.next.addEventListener("click", () => this.slideNext());

        //throw them into a common div
        //which will give us a bit more styling options
        const nav = document.createElement("div");
        nav.classList.add("slider-nav");
        nav.appendChild(this.prev);
        nav.appendChild(this.next);

        //diva with the buttons into the slide
        this.slider.appendChild(nav);
    }


    createPagination() {
        const ulDots = document.createElement("ul");
        ulDots.classList.add("slider-pagination");

        //tworzymy pętlę w ilości liczby slajdów
        for (let i=0; i<this.slides.length; i++) {
            //each time we create a LI with a button
            //each button will change the slide when clicked
            // using the changeSlide() method

            const li = document.createElement("li");
            li.classList.add("slider-pagination-element");

            const btn = document.createElement("button");
            btn.classList.add("slider-pagination-button");
            btn.type = "button";
            btn.innerText = i+1;
            btn.setAttribute("aria-label", `Ustaw slajd ${i+1}`);

            btn.addEventListener("click", () => this.changeSlide(i));

            li.appendChild(btn);

            ulDots.appendChild(li);

            //the generated button is put into a common array
            //this will make it easier to refer to the dots later
            this.dots.push(li);
        }

        this.slider.appendChild(ulDots);
    }


    changeSlide(index) {
        // loop through the slides removing the active class

        this.slides.forEach(slide => {
            slide.classList.remove("slider-slide-active");
            slide.setAttribute("aria-hidden", true);
        });

        // we add it only to the selected one
        this.slides[index].classList.add("slider-slide-active");
        this.slides[index].setAttribute("aria-hidden", false);

        //we do a similar maneuver for dots
        if (this.options.generateDots) {
            this.dots.forEach(dot => {
                dot.classList.remove("slider-pagination-element-active");
            });
            this.dots[index].classList.add("slider-pagination-element-active");
        }

        // current slide is switched to the selected one
        this.currentSlide = index;



        if (typeof this.options.pauseTime === "number" && this.options.pauseTime !== 0) {
            clearInterval(this.time);
            this.time = setTimeout(() => this.slideNext(), this.options.pauseTime);
        }
    }

    slidePrev() {
        this.currentSlide--;
        if (this.currentSlide < 0) {
            this.currentSlide = this.slides.length - 1;
        }
        this.changeSlide(this.currentSlide);
    }

    slideNext() {
        this.currentSlide++;
        if (this.currentSlide > this.slides.length - 1) {
            this.currentSlide = 0;
        }
        this.changeSlide(this.currentSlide);
    }

}

const opts1 = {
    pauseTime : 4000,
    prevText : "Poprzedni",
    nextText : "Następny",
    generatePrevNext : true,
    generateDots: true
}
const slide1 = new Slider("#slider1", opts1, 1);



// const opts2 = {
//     pauseTime : 4000,
//     prevText : "Poprzedni",
//     nextText : "Następny",
//     generatePrevNext : true,
//     generateDots: true
// }
// const slide2 = new Slider("#slider2", opts1, 2);

