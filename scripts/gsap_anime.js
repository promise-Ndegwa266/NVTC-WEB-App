gsap.registerPlugin(ScrollTrigger)

window.addEventListener('load',()=>{

    gsap.from(".illustration", {
        opacity:0,
        y:75,
        duration:3,
        scrollTrigger:{
            trigger:'.illustration',
            start: 'top 90%',
            end:'top 30%',
            scrub:true,
            markers:false
        }
    });

    gsap.from(".hero-buttons", {
        opacity:0,
        y:25,
        duration:2
    });

    gsap.from(".text-head", {
        opacity:0,
        y:65,
        duration:3
    });

    gsap.from(".paregraph", {
        opacity:0,
        y:55,
        duration:4
    });
    gsap.from(".about-image",{
        scale:0.5,
        opacity:0,
        duration:2,
        scrollTrigger:{
            trigger:'.about-image',
            start:'top 95%',
            end:'top 40%',
            scrub:true,
            markers:false
        }
    })
    gsap.from(".card-one", {
        opacity:0,
        x:-350,
        duration:4,
        scrollTrigger:{
            trigger:'.card-one',
            start: 'top 85%',
            end:'top 30%',
            scrub:true,
            markers:false
        }
    });
    gsap.from(".card-two", {
        opacity:0,
        y:75,
        duration:4,
        scrollTrigger:{
            trigger:'.card-two',
            start: 'top 80%',
            end:'top 30%',
            scrub:true,
            markers:false
        }
    });
    gsap.from(".admission-card-one", {
        opacity:0,
        y:75,
        duration:3,
        scrollTrigger:{
            trigger:'.admission-card-one',
            start: 'top 75%',
            end:'top 35%',
            scrub:true,
            markers:false
        }
    });
    gsap.from(".admission-card-two", {
        opacity:0,
        y:75,
        duration:3,
        scrollTrigger:{
            trigger:'.admission-card-two',
            start: 'top 75%',
            end:'top 35%',
            scrub:true,
            markers:false
        }
    });
    gsap.from(".admission-card-three", {
        opacity:0,
        y:75,
        duration:3,
        scrollTrigger:{
            trigger:'.admission-card-three',
            start: 'top 75%',
            end:'top 35%',
            scrub:true,
            markers:false
        }
    });

})
