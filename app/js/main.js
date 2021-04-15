const slider = document.querySelectorAll('#slider'),
    sliderItems = document.querySelector('#slides'),
    sliderDots = document.querySelector('#slider-dots')



function slide(wrapper, items, dotsCon = null) {
    let posY1 = 0,
        posY2 = 0,
        posInitial,
        posFinal,
        threshold = 100,
        slides = items.getElementsByClassName('slider__slide'),
        slideHeight = slides[0].offsetHeight,
        slidesLength = items.length,
        firstSlide = slides[0],
        lastSlide = slides[slides.length - 1],
        index = 0,
        allowShift = true


    //Mouse events
    items.onmousedown = dragStart

    //Touch events
    items.addEventListener('touchstart', dragStart)
    items.addEventListener('touchend', dragEnd)
    items.addEventListener('touchmove', dragAction)

    //Transition events 
    items.addEventListener('transitionend', () => {
        items.classList.remove('shifting')
        allowShift = true;
    })

    //create dots
    if (dotsCon) {
        createDots(dotsCon, index)
        setActiveDot(index)
    }

    function dragStart(e) {
        e = e || window.event
        e.preventDefault()
        posInitial = items.offsetTop


        if (e.type === 'touchstart') {
            posY1 = e.touches[0].clientY
        } else {
            posY1 = e.clientY
            document.onmouseup = dragEnd;
            document.onmousemove = dragAction;
        }
    }

    function dragAction(e) {
        e = e || window.event

        if (e.type === 'touchmove') {
            posY2 = posY1 - e.touches[0].clientY
            posY1 = e.touches[0].clientY

        } else {
            posY2 = posY1 - e.clientY
            posY1 = e.clientY
        }

        items.style.top = (items.offsetTop - posY2) + 'px'
    }

    function dragEnd(e) {
        posFinal = items.offsetTop

        if (posFinal - posInitial < -threshold && index < slides.length - 1) {
            shiftSlide(1, 'drag')
        } else if (posFinal - posInitial > threshold && index > 0) {
            shiftSlide(-1, 'drag')
        } else {
            items.style.top = (posInitial) + "px"
        }

        document.onmouseup = null;
        document.onmousemove = null;
    }

    function shiftSlide(dir, action) {
        items.classList.add('shifting')

        if (allowShift) {
            if (dir === 1) {
                items.style.top = (posInitial - slideHeight) + 'px'
                index++
            } else if (dir === -1) {
                items.style.top = (posInitial + slideHeight) + 'px'
                index--
            }
        }

        setActiveDot(index)
        allowShift = false
    }

    function createDots(container) {
        const dots = Array.from(slides).map((slide, id) => {
            const el = document.createElement('div')
            el.classList.add(`slider__dot`, `slider_dot__${id}`)
            return el
        })

        dots.forEach(dot => {
            dotsCon.append(dot)
        });
    }

    function setActiveDot(activeIndex) {
        const dots = document.querySelectorAll('.slider__dot')
        if (dots.length > 0) {
            dots.forEach((dot, id) => {
                if (id === activeIndex) dot.classList.add('active')
                else dot.classList.remove('active')
            })
        }
    }




}


slide(slider, sliderItems, sliderDots)

