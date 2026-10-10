gsap.registerPlugin(ScrollTrigger)

window.addEventListener('load',()=>{
    gsap.from('.hero-badge',{
        opacity:0,
        y:35,
        duration:2
    })
    gsap.from('.header-one',{
        opacity:0,
        y:35,
        duration:4
    })
    gsap.from('.paragraph-text',{
        opacity:0,
        y:35,
        duration:3
    })

})