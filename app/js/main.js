document.addEventListener("DOMContentLoaded", () => {
    //slider
    const sliderItems = document.querySelector('#slides'),
        sliderDots = document.querySelector('#slider-dots'),
        //input range
        inputSlider = document.querySelector('#slider2__range'),
        //slider2
        slider2Items = document.querySelector('#slider2__slides')



    sliderVertical(sliderItems, sliderDots)
    sliderHorizontal(inputSlider, slider2Items)

    window.addEventListener('resize', () => {
        location.href = location.href;
    })


    function sliderVertical(items, dotsCon = null) {
        let posY1 = 0,
            posY2 = 0,
            posInitial,
            posFinal,
            threshold = 100,
            slides = items.getElementsByClassName('slider__slide'),
            slideHeight = slides[0].offsetHeight,
            index = 0,
            allowShift = true,
            minTopScroll = 30,
            maxTopScroll = -((slides.length - 1) * slideHeight + minTopScroll)


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

            const valueShiptTop = items.offsetTop - posY2


            if (items.offsetTop < minTopScroll && items.offsetTop > maxTopScroll) {
                items.style.top = (items.offsetTop - posY2) + 'px'
            }


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

        function shiftSlide(dir) {
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

    function sliderHorizontal(selector, items) {

        let currentSlide = 2,
            slideWidth = document.querySelector('.slider2__slide').offsetWidth,
            allowShift = true


        //mouse events
        selector.addEventListener('mousedown', (e) => {
            e.stopPropagation()
        })
        selector.addEventListener('mousemove', eventMove)
        selector.addEventListener('mouseup', eventEnd)
        //toches events
        selector.addEventListener('touchstart', (e) => {
            e.stopPropagation()
        })
        selector.addEventListener('touchmove', eventMove)
        selector.addEventListener('touchend', eventEnd)

        function eventMove(e) {
            e.stopPropagation()
            setBackground(selector)
            const x = selector.value


            if (x < 30) {
                shiftSlide(0)
            } else if (x >= 30 && x <= 70) {
                shiftSlide(1)
            } else {
                shiftSlide(2)
            }
        }

        function eventEnd(e) {
            e.stopPropagation()
            const x = selector.value
            if (x < 30) {
                selector.value = 0
            } else if (x >= 30 && x <= 70) {
                selector.value = 50
            } else {
                selector.value = 100
            }

            setBackground()
        }


        items.addEventListener('transitionend', () => {

            items.classList.remove('shifting')
            allowShift = true;
        })


        shiftSlide(currentSlide, true)
        setBackground()




        function setBackground() {
            const x = selector.value
            selector.style.background = `linear-gradient(to right, rgba(0, 0, 0, 0) 2%, #D1EAFF 2%, #D1EAFF ${x - 2}%, #435063 ${x - 2}%, #435063 98%, rgba(0, 0, 0, 0) 98%)`
        }


        function shiftSlide(slide, initial = false) {
            items.classList.add('shifting')


            if (initial || currentSlide != slide && allowShift) {

                items.style.right = (slide * slideWidth) + "px"
                currentSlide = slide

                allowShift = false
            }

        }

    }


})
