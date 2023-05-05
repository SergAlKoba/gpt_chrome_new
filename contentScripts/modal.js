const toneItemsData = [
    { url: 'assets/images/tone_item_1.png', title: "Monochrome scheme", name: "none" },
    { url: 'assets/images/tone_item_2.png', title: "Blue ocean", name: "blue_ocean" },
    { url: 'assets/images/tone_item_3.png', title: "Lime vulcanic", name: "lime_vulcanic" },
    { url: 'assets/images/tone_item_4.png', title: "Colorful gradient", name: "colorful_gradient" },
    { url: 'assets/images/tone_item_5.png', title: "Textury art", name: "textury" },
];
const styleItemData = [
    { title: 'Default', name: 'global_fonts' },
    { title: 'Roboto', name: 'roboto' },
    { title: 'Montserrat', name: 'montserrat' },
    { title: 'Roboto Condensed', name: 'roboto_condensed' },
];

function createTabsDiv() {
    let tabsDiv = document.createElement('div');
    tabsDiv.className = 'tabs';

    let ul = document.createElement('ul');
    ul.className = 'tabs_nav';
    tabsDiv.appendChild(ul);

    let li1 = document.createElement('li');
    li1.setAttribute('data-tabs', 'tone');
    li1.className = 'tabs_item active';
    li1.textContent = 'Tone';
    ul.appendChild(li1);

    let li2 = document.createElement('li');
    li2.setAttribute('data-tabs', 'style');
    li2.className = 'tabs_item';
    li2.textContent = 'Style';
    ul.appendChild(li2);

    let tabsNavContentTone = document.createElement('div');
    tabsNavContentTone.setAttribute('class', 'tabs_nav_content tone active');

    let toneItems = document.createElement('div');
    toneItems.setAttribute('class', 'tone_items');

    for (let i = 0; i < toneItemsData.length; i++) {
        const item = toneItemsData[i];
        let toneItem = document.createElement('div');
        toneItem.setAttribute('class', 'tone_item');
        toneItem.setAttribute('data-theme', item.name);
        if (item.name == selectedTone) {
            toneItem.classList.add("active");
        }
        toneItem.style.setProperty("--checkIcon", `url(${chrome.runtime.getURL("assets/images/tone_item_check.svg")})`);
        let toneItemImg = document.createElement('img');
        toneItemImg.setAttribute('src', chrome.runtime.getURL(item.url));
        toneItemImg.setAttribute('alt', '');
        let toneItemHeading = document.createElement('h4');
        toneItemHeading.textContent = item.title;
        let toneItemParagraph = document.createElement('p');
        toneItemParagraph.textContent = 'by John Bolino';

        toneItem.onclick = () => {
            selectedTone = item.name;
            applyCurrentTheme();
            Array.from(toneItems.children).forEach(item => {
                item.classList.remove("active");
            });
            toneItem.classList.add("active");
        };

        toneItem.append(toneItemImg, toneItemHeading, toneItemParagraph);
        toneItems.append(toneItem);
    }

    tabsNavContentTone.append(toneItems);

    let styleItems = document.createElement('div');
    styleItems.setAttribute('class', 'style_items');



    for (let i = 0; i < styleItemData.length; i++) {
        let item = styleItemData[i];
        let styleItem = document.createElement('div');
        styleItem.setAttribute('class', 'style_item');
        styleItem.setAttribute('data-font', item.name);

        if (item.name == selectedStyle) {
            styleItem.classList.add("active");
        }

        let h4 = document.createElement('h4');
        h4.classList.add(item.name);
        h4.innerText = item.title;
        styleItem.appendChild(h4);

        let p = document.createElement('p');
        p.classList.add(item.name);
        p.innerText = 'The quick brown fox jumps over the lazy dog';


        styleItem.onclick = () => {
            selectedStyle = item.name;
            applyCurrentTheme();
            Array.from(styleItems.children).forEach(item => {
                item.classList.remove("active");
            });
            styleItem.classList.add("active");
        };


        styleItem.appendChild(p);

        styleItems.appendChild(styleItem);

    }

    let tabsNavContentStyle = document.createElement('div');
    tabsNavContentStyle.setAttribute('class', 'tabs_nav_content style');
    tabsNavContentStyle.appendChild(styleItems);

    li1.onclick = () => {
        li1.classList.add("active");
        li2.classList.remove("active");
        tabsNavContentTone.classList.add('active');
        tabsNavContentStyle.classList.remove('active');
    };
    li2.onclick = () => {
        li1.classList.remove("active");
        li2.classList.add("active");
        tabsNavContentTone.classList.remove('active');
        tabsNavContentStyle.classList.add('active');
    };



    tabsDiv.appendChild(tabsNavContentTone);
    tabsDiv.appendChild(tabsNavContentStyle);

    return {
        element: tabsDiv, toneItems, styleItems
    };
}

function createForm(tabsDiv) {
    let form = document.createElement("form");
    form.setAttribute("action", "");
    let button = document.createElement("button");
    button.onclick = (e) => {
        e.preventDefault();
    }
    form.appendChild(button);

    let img = document.createElement("img");
    img.setAttribute('src', chrome.runtime.getURL('assets/images/search.svg'));
    img.setAttribute("alt", "");
    button.appendChild(img);

    let input = document.createElement("input");
    input.setAttribute("type", "search");
    input.setAttribute("placeholder", "Search theme...");
    form.appendChild(input);


    function filterItems(searchText) {
        const normalizeText = (text) => {
            return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        };
    
        const searchRegExp = new RegExp(normalizeText(searchText), 'g');
    
        Array.from(document.querySelectorAll(".tone_item, .style_item")).forEach(item => {
            const titleElement = item.querySelector("h4");
            const itemText = titleElement ? normalizeText(titleElement.textContent) : "";
    
            if (normalizeText(searchText).length < 2) {
                item.style.display = "block";
            } else {
                if (!itemText.match(searchRegExp)) {
                    item.style.display = "none";
                } else {
                    item.style.display = "block";
                }
            }
        });
    }
    

    input.oninput = (e) => {
        filterItems(e.target.value);
    }
    
    return form;
}

function createSettingsDiv() {
    let settingsDiv = document.createElement("div");
    settingsDiv.className = "settings_content";

    let applyLink = document.createElement("a");
    applyLink.setAttribute("class", "apply");
    applyLink.setAttribute("href", "#");
    applyLink.textContent = "Apply";

    applyLink.onclick = (e) => {
        e.preventDefault();
        localStorage.setItem('tone', selectedTone);
        localStorage.setItem('style', selectedStyle);
        document.querySelector("#global .theme_settings_content")?.classList.remove("active");

        return false;
    };

    const tabsDiv = createTabsDiv();

    settingsDiv.appendChild(createForm(tabsDiv));
    settingsDiv.appendChild(tabsDiv.element);
    settingsDiv.appendChild(applyLink);
    return settingsDiv;

}

function createModal() {
    let div = document.createElement("div");
    div.className = "theme_settings_content";

    let span = document.createElement("span");
    span.className = "close";
    span.onclick = () => {
        selectedTone = selectedToneTmp;
        selectedStyle = selectedStyleTmp;

        document.querySelectorAll(".theme_settings_content [data-theme]").forEach(item => {
            item.classList.remove("active");
        });

        document.querySelectorAll(".theme_settings_content [data-font]").forEach(item => {
            item.classList.remove("active");
        });

        document.querySelector(`.theme_settings_content [data-theme="${selectedTone}"]`).classList.add("active");
        document.querySelector(`.theme_settings_content [data-font="${selectedStyle}"]`).classList.add("active");
        div.classList.remove("active");
        
        applyCurrentTheme();
    };

    div.appendChild(span);
    div.appendChild(createSettingsDiv());

    return div;
};

document.body.appendChild(createModal());


// document.querySelector('#global .flex.h-full.max-w-full.flex-1.flex-col').classList.add('active')
