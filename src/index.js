import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import Notiflix, { Notify } from 'notiflix';
import debounce from 'lodash.debounce';

const refs = {
    inputEl: document.querySelector('input#search-box'),
    listEl: document.querySelector('.country-list'),
    infoEl: document.querySelector('.country-info')
}
const DEBOUNCE_DELAY = 300;

refs.inputEl.addEventListener ('input',debounce(onFormInput,DEBOUNCE_DELAY));

function onFormInput(e) {
    e.preventDefault()
    let serchValue = e.target.value.trim()
    if(serchValue==='') {
            clear()
        }
    fetchCountries(serchValue)
        .then(countries=>{ 
            if(countries.length>10){
                clear()
                return Notify.info("Too many matches found. Please enter a more specific name.")
            }
            const markup = countries.map(({flags,name}) => { return `
            <li class="country-item">
            <img class="country-image" src="${flags.svg}" alt="${name.official}" width="40" height="20">
            <p class="country-name">${name.official}</p>
            </li>`})
            .join('')
            clearInfo()
            refs.listEl.innerHTML = markup;
            if(countries.length===1) {
                clear()
                const infoMarkup = countries.map(({name,flags,population,capital,languages})=>{return `
                <li class="country-item">
                <img class="country-image" src="${flags.svg}" alt="${name.official}" width="40" height="20">
                <p class="country-title">${name.official}</p>
                </li>                
                <div class="country-info">
                <p class="country-text">Capital: ${capital}</p>
                <p class="country-text">Population: ${population}</p>
                <ul class="lang-list"
                <li class="lang-item">Languages: ${Object.values(languages).join(', ')}</li>
                </ul>
                </div>
                `})
                .join('')
                refs.infoEl.innerHTML = infoMarkup
            }
        })
        .catch(e=>{
            clear()
            Notify.failure(`Oops, there is no country with that name`)
        })
}

function clear() {
    refs.infoEl.innerHTML = ''
    refs.listEl.innerHTML = ''
}

function clearInfo() {
    refs.infoEl.innerHTML = ''
}

// function renderMarkup(name) {
//     const markup = name
//     .map(({capital,population,flags,languages})=> {
//         return 
//         `<ul class="country-list"> 
//             {#each name}
//             <li class="country-list__item"><img class="country-list__image" src="${flags.svg}" alt="${name.official}"></li>
//             <li class="country-list__item"><h2 class="country-list__title">${name.official}</h2></li>
//             {/#each}
//         </ul>
//         <div class="country-info">
//         <p class="country-text">${capital}</p>
//         <p class="country-text">${population}</p>
//         <ul class="lang-list"
//             {#each languages}
//             <li class="lang-item">Languages:${languages}</li>
//             {/#each}
//         </ul>
//         </div>
//         `;
//     })
//     .join('');
//     refs.list.innerHTML = markup;
//     console.log(name)
// }
