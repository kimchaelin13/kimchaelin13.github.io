'use strict';

// 1. Make navbar transparent when it is on the top

// 검색 js element size
const navbar = document.querySelector('#navbar');
const navbarHeight = navbar.getBoundingClientRect().height;

// 검색 javascript scroll position
document.addEventListener('scroll', () => {
    // console.log(`navbarHeight: ${navbarHeight}`);
    if (window.scrollY > navbarHeight) {
        navbar.classList.add('navbar--dark')
    } else {
        navbar.classList.remove('navbar--dark')
    }

});




// 2. Handle scrolling when tapping ont the navbar menu
// 아이디로 어떻게 스크롤 내려가게 할 수 있을까? 구글 js scroll to id -> element scrollIntoView
const navbarMenu = document.querySelector('.navbar__menu')
navbarMenu.addEventListener('click',(event) => {
    const target = event.target
    const link = target.dataset.link;
    if (link == null) {
        return;
    }
    navbarMenu.classList.remove('open')
    scrollIntoView(link);
    selectedNavItem(target)
})


//Navbar toggle btn for small screen
const navbarToggleBtn = document.querySelector('.navbar__toggle-btn')
navbarToggleBtn.addEventListener('click', () => {
    navbarMenu.classList.toggle('open')
})



// 2-1. contact me를 눌렀을때 넘어가게 contact로 넘어가게 하기
const contactButton = document.querySelector('.home__contact')
contactButton.addEventListener('click', (event) => {
    scrollIntoView('#contact')
});



// 3.Make Home slowly fade to transparent as the widnow scrolls down
const home = document.querySelector('.home__container')
const homeHeight = home.getBoundingClientRect().height;
document.addEventListener('scroll', () => {
    // console.log(1-(window.scrollY / homeHeight))
    home.style.opacity = 1-(window.scrollY / homeHeight)
})


// 4. Show 'arrow up" button when scrolling down (Elly)
const arrowUp = document.querySelector('.arrow-up')
document.addEventListener('scroll',() => {
    if(window.scrollY > homeHeight/2) {
        arrowUp.classList.add('visible')
    } else {
        arrowUp.classList.remove('visible')
    }
})


// 5. handle click on the 'arrow up' button
arrowUp.addEventListener('click', () => {
    scrollIntoView('#home')
})


// Projects
const workBtnContainer = document.querySelector('.work__categories')
const projectContaier = document.querySelector('.work__projects')
const projects = document.querySelectorAll('.project')
workBtnContainer.addEventListener('click', (e) => {
    const filter = e.target.dataset.filter || e.target.parentNode.dataset.filter ;
    if (filter == null) {
        return ;
    }

    // Remove selection from the previous item and select the new one
    const active = document.querySelector('.category__btn.selected');
    if (active != null) {
        active.classList.remove('selected');
    }
    e.target.classList.add('selected');

    // 애니메아웃 추가하고 끝나고
    // 0.3초 이후에 실행함
    projectContaier.classList.add('anim-out');
    setTimeout(() => {
        projects.forEach((project) => {
            // console.log(project.dataset.type);
            if (filter === '*' || filter === project.dataset.type) {
                project.classList.remove('invisible');
            } else {
                project.classList.add('invisible');
            }
        })
        projectContaier.classList.remove('anim-out');
    }, 300);


})





// 4. Show 'arrow up" button when scrolling down (myver)
// const myBtn = document.querySelector('.arrow-up')
// window.onscroll = function() {scrollFunction()}

// function scrollFunction() {
//     if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
//         myBtn.style.display = 'block'
//     } else {
//         myBtn.style.display = 'none'
//     }
// }

// myBtn.addEventListener('click', () => {
//     document.documentElement.scrollTop = 0;
// });


//1.모든 섹션 요소들을 가지고 온다
//2. IntersectionObserver를 이용해서 모든 섹션들을 관찰한다
//3.보여지는 섹션에 해당하는 메뉴 아이템을 활성화 시킨다

//1
const sectionIds = [
    '#home',
    '#about',
    '#skills',
    '#work',
    '#testimonials',
    '#contact',
];

const sections = sectionIds.map(id => document.querySelector(id));
const navItems = sectionIds.map(id => 
    document.querySelector(`[data-link="${id}"]`)
)
console.log(sections)
console.log(navItems)


//2.현재 선택된 메뉴인덱스와 메뉴여ㅛ소를 변수에 저장

let selectedNavIndex = 0;
let selectedNavItems = navItems[0];
function selectedNavItem(selected) {
    selectedNavItems.classList.remove('active');
    selectedNavItems = selected;
    selectedNavItems.classList.add('active');
}


function scrollIntoView(selector) {
    const scrollTo = document.querySelector(selector);
    scrollTo.scrollIntoView({ behavior: 'smooth' });
    selectedNavItemse(navItems[sectionIds.indexOf(selector)]);
}

  

const observerOptions = {
    root:null,
    rootMargin:'0px',
    threshold:0.3,
}

const observerCallback = ((entries,observer) => {
    entries.forEach(entry => {
        //빠져나갈때를 기준으로 할거니까
        if (!entry.isIntersecting && entry.intersectionRatio >0) {
            const index = sectionIds.indexOf(`#${entry.target.id}`);
            // 스크롤링이 아레로 되어서 페이지가 올라옴
            if (entry.boundingClientRect.y < 0) {
                selectedNavIndex = index + 1 
            } else {
                //2.페이지가 내려가는 경우 (y가 +인경우)
                selectedNavIndex = index - 1 
            }
        }

    })
})
const observer = new IntersectionObserver(observerCallback,observerOptions)

sections.forEach(section => observer.observe(section))


window.addEventListener('wheel',() => {
    if (window.scrollY === 0) {
        selectedNavIndex = 0;
    } else if (window.scrollY + window.innerHeight === document.body.clientHeight) {
        // 제일 밑으로 도달했다면
        selectedNavIndex = navItems.length - 1;
    }
    selectedNavItem(navItems[selectedNavIndex]);
})
