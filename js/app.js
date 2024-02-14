(() => {
    "use strict";
    const modules_flsModules = {};
    function isWebp() {
        function testWebP(callback) {
            let webP = new Image;
            webP.onload = webP.onerror = function() {
                callback(webP.height == 2);
            };
            webP.src = "data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA";
        }
        testWebP((function(support) {
            let className = support === true ? "webp" : "no-webp";
            document.documentElement.classList.add(className);
        }));
    }
    let _slideUp = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = `${target.offsetHeight}px`;
            target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            window.setTimeout((() => {
                target.hidden = !showmore ? true : false;
                !showmore ? target.style.removeProperty("height") : null;
                target.style.removeProperty("padding-top");
                target.style.removeProperty("padding-bottom");
                target.style.removeProperty("margin-top");
                target.style.removeProperty("margin-bottom");
                !showmore ? target.style.removeProperty("overflow") : null;
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideUpDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideDown = (target, duration = 500, showmore = 0) => {
        if (!target.classList.contains("_slide")) {
            target.classList.add("_slide");
            target.hidden = target.hidden ? false : null;
            showmore ? target.style.removeProperty("height") : null;
            let height = target.offsetHeight;
            target.style.overflow = "hidden";
            target.style.height = showmore ? `${showmore}px` : `0px`;
            target.style.paddingTop = 0;
            target.style.paddingBottom = 0;
            target.style.marginTop = 0;
            target.style.marginBottom = 0;
            target.offsetHeight;
            target.style.transitionProperty = "height, margin, padding";
            target.style.transitionDuration = duration + "ms";
            target.style.height = height + "px";
            target.style.removeProperty("padding-top");
            target.style.removeProperty("padding-bottom");
            target.style.removeProperty("margin-top");
            target.style.removeProperty("margin-bottom");
            window.setTimeout((() => {
                target.style.removeProperty("height");
                target.style.removeProperty("overflow");
                target.style.removeProperty("transition-duration");
                target.style.removeProperty("transition-property");
                target.classList.remove("_slide");
                document.dispatchEvent(new CustomEvent("slideDownDone", {
                    detail: {
                        target
                    }
                }));
            }), duration);
        }
    };
    let _slideToggle = (target, duration = 500) => {
        if (target.hidden) return _slideDown(target, duration); else return _slideUp(target, duration);
    };
    let bodyLockStatus = true;
    let bodyLockToggle = (delay = 500) => {
        if (document.documentElement.classList.contains("lock")) bodyUnlock(delay); else bodyLock(delay);
    };
    let bodyUnlock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            setTimeout((() => {
                for (let index = 0; index < lock_padding.length; index++) {
                    const el = lock_padding[index];
                    el.style.paddingRight = "0px";
                }
                body.style.paddingRight = "0px";
                document.documentElement.classList.remove("lock");
            }), delay);
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    let bodyLock = (delay = 500) => {
        let body = document.querySelector("body");
        if (bodyLockStatus) {
            let lock_padding = document.querySelectorAll("[data-lp]");
            for (let index = 0; index < lock_padding.length; index++) {
                const el = lock_padding[index];
                el.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            }
            body.style.paddingRight = window.innerWidth - document.querySelector(".wrapper").offsetWidth + "px";
            document.documentElement.classList.add("lock");
            bodyLockStatus = false;
            setTimeout((function() {
                bodyLockStatus = true;
            }), delay);
        }
    };
    function spollers() {
        const spollersArray = document.querySelectorAll("[data-spollers]");
        if (spollersArray.length > 0) {
            document.addEventListener("click", setSpollerAction);
            const spollersRegular = Array.from(spollersArray).filter((function(item, index, self) {
                return !item.dataset.spollers.split(",")[0];
            }));
            if (spollersRegular.length) initSpollers(spollersRegular);
            let mdQueriesArray = dataMediaQueries(spollersArray, "spollers");
            if (mdQueriesArray && mdQueriesArray.length) mdQueriesArray.forEach((mdQueriesItem => {
                mdQueriesItem.matchMedia.addEventListener("change", (function() {
                    initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
                }));
                initSpollers(mdQueriesItem.itemsArray, mdQueriesItem.matchMedia);
            }));
            function initSpollers(spollersArray, matchMedia = false) {
                spollersArray.forEach((spollersBlock => {
                    spollersBlock = matchMedia ? spollersBlock.item : spollersBlock;
                    if (matchMedia.matches || !matchMedia) {
                        spollersBlock.classList.add("_spoller-init");
                        initSpollerBody(spollersBlock);
                    } else {
                        spollersBlock.classList.remove("_spoller-init");
                        initSpollerBody(spollersBlock, false);
                    }
                }));
            }
            function initSpollerBody(spollersBlock, hideSpollerBody = true) {
                let spollerItems = spollersBlock.querySelectorAll("details");
                if (spollerItems.length) spollerItems.forEach((spollerItem => {
                    let spollerTitle = spollerItem.querySelector("summary");
                    if (hideSpollerBody) {
                        spollerTitle.removeAttribute("tabindex");
                        if (!spollerItem.hasAttribute("data-open")) {
                            spollerItem.open = false;
                            spollerTitle.nextElementSibling.hidden = true;
                        } else {
                            spollerTitle.classList.add("_spoller-active");
                            spollerItem.open = true;
                        }
                    } else {
                        spollerTitle.setAttribute("tabindex", "-1");
                        spollerTitle.classList.remove("_spoller-active");
                        spollerItem.open = true;
                        spollerTitle.nextElementSibling.hidden = false;
                    }
                }));
            }
            function setSpollerAction(e) {
                const el = e.target;
                if (el.closest("summary") && el.closest("[data-spollers]")) {
                    e.preventDefault();
                    if (el.closest("[data-spollers]").classList.contains("_spoller-init")) {
                        const spollerTitle = el.closest("summary");
                        const spollerBlock = spollerTitle.closest("details");
                        const spollersBlock = spollerTitle.closest("[data-spollers]");
                        const oneSpoller = spollersBlock.hasAttribute("data-one-spoller");
                        const scrollSpoller = spollerBlock.hasAttribute("data-spoller-scroll");
                        const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                        if (!spollersBlock.querySelectorAll("._slide").length) {
                            if (oneSpoller && !spollerBlock.open) hideSpollersBody(spollersBlock);
                            !spollerBlock.open ? spollerBlock.open = true : setTimeout((() => {
                                spollerBlock.open = false;
                            }), spollerSpeed);
                            spollerTitle.classList.toggle("_spoller-active");
                            _slideToggle(spollerTitle.nextElementSibling, spollerSpeed);
                            if (scrollSpoller && spollerTitle.classList.contains("_spoller-active")) {
                                const scrollSpollerValue = spollerBlock.dataset.spollerScroll;
                                const scrollSpollerOffset = +scrollSpollerValue ? +scrollSpollerValue : 0;
                                const scrollSpollerNoHeader = spollerBlock.hasAttribute("data-spoller-scroll-noheader") ? document.querySelector(".header").offsetHeight : 0;
                                window.scrollTo({
                                    top: spollerBlock.offsetTop - (scrollSpollerOffset + scrollSpollerNoHeader),
                                    behavior: "smooth"
                                });
                            }
                        }
                    }
                }
                if (!el.closest("[data-spollers]")) {
                    const spollersClose = document.querySelectorAll("[data-spoller-close]");
                    if (spollersClose.length) spollersClose.forEach((spollerClose => {
                        const spollersBlock = spollerClose.closest("[data-spollers]");
                        const spollerCloseBlock = spollerClose.parentNode;
                        if (spollersBlock.classList.contains("_spoller-init")) {
                            const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                            spollerClose.classList.remove("_spoller-active");
                            _slideUp(spollerClose.nextElementSibling, spollerSpeed);
                            setTimeout((() => {
                                spollerCloseBlock.open = false;
                            }), spollerSpeed);
                        }
                    }));
                }
            }
            function hideSpollersBody(spollersBlock) {
                const spollerActiveBlock = spollersBlock.querySelector("details[open]");
                if (spollerActiveBlock && !spollersBlock.querySelectorAll("._slide").length) {
                    const spollerActiveTitle = spollerActiveBlock.querySelector("summary");
                    const spollerSpeed = spollersBlock.dataset.spollersSpeed ? parseInt(spollersBlock.dataset.spollersSpeed) : 500;
                    spollerActiveTitle.classList.remove("_spoller-active");
                    _slideUp(spollerActiveTitle.nextElementSibling, spollerSpeed);
                    setTimeout((() => {
                        spollerActiveBlock.open = false;
                    }), spollerSpeed);
                }
            }
        }
    }
    function menuInit() {
        if (document.querySelector(".icon-menu") || document.querySelector(".menu__body-icon")) document.addEventListener("click", (function(e) {
            if (bodyLockStatus && (e.target.closest(".icon-menu") || e.target.closest(".menu__body-icon"))) {
                bodyLockToggle();
                document.documentElement.classList.toggle("menu-open");
            }
        }));
    }
    function functions_menuClose() {
        bodyUnlock();
        document.documentElement.classList.remove("menu-open");
    }
    function FLS(message) {
        setTimeout((() => {
            if (window.FLS) console.log(message);
        }), 0);
    }
    function uniqArray(array) {
        return array.filter((function(item, index, self) {
            return self.indexOf(item) === index;
        }));
    }
    function dataMediaQueries(array, dataSetValue) {
        const media = Array.from(array).filter((function(item, index, self) {
            if (item.dataset[dataSetValue]) return item.dataset[dataSetValue].split(",")[0];
        }));
        if (media.length) {
            const breakpointsArray = [];
            media.forEach((item => {
                const params = item.dataset[dataSetValue];
                const breakpoint = {};
                const paramsArray = params.split(",");
                breakpoint.value = paramsArray[0];
                breakpoint.type = paramsArray[1] ? paramsArray[1].trim() : "max";
                breakpoint.item = item;
                breakpointsArray.push(breakpoint);
            }));
            let mdQueries = breakpointsArray.map((function(item) {
                return "(" + item.type + "-width: " + item.value + "px)," + item.value + "," + item.type;
            }));
            mdQueries = uniqArray(mdQueries);
            const mdQueriesArray = [];
            if (mdQueries.length) {
                mdQueries.forEach((breakpoint => {
                    const paramsArray = breakpoint.split(",");
                    const mediaBreakpoint = paramsArray[1];
                    const mediaType = paramsArray[2];
                    const matchMedia = window.matchMedia(paramsArray[0]);
                    const itemsArray = breakpointsArray.filter((function(item) {
                        if (item.value === mediaBreakpoint && item.type === mediaType) return true;
                    }));
                    mdQueriesArray.push({
                        itemsArray,
                        matchMedia
                    });
                }));
                return mdQueriesArray;
            }
        }
    }
    window.addEventListener("load", windowLoad);
    function windowLoad() {
        const htmlBlock = document.documentElement;
        const saveUserTheme = localStorage.getItem("user-theme");
        let UserTheme;
        if (window.matchMedia) UserTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e => {
            !saveUserTheme ? changeTheme() : null;
        }));
        const themeButton = document.querySelector(".page__theme");
        const resetButton = document.querySelector(".page__reset");
        if (themeButton) themeButton.addEventListener("click", (function(e) {
            resetButton.classList.add("active");
            changeTheme(true);
        }));
        if (resetButton) resetButton.addEventListener("click", (function(e) {
            resetButton.classList.remove("active");
            localStorage.setItem("user-theme", "");
        }));
        function setThemeClass() {
            if (saveUserTheme) {
                htmlBlock.classList.add(saveUserTheme);
                resetButton.classList.add("active");
            } else htmlBlock.classList.add(UserTheme);
        }
        setThemeClass();
        function changeTheme(saveTheme = false) {
            let currentTheme = htmlBlock.classList.contains("light") ? "light" : "dark";
            let newTheme;
            if (currentTheme === "light") newTheme = "dark"; else if (currentTheme === "dark") newTheme = "light";
            htmlBlock.classList.remove(currentTheme);
            htmlBlock.classList.add(newTheme);
            saveTheme ? localStorage.setItem("user-theme", newTheme) : null;
        }
    }
    let gotoblock_gotoBlock = (targetBlock, noHeader = false, speed = 500, offsetTop = 0) => {
        const targetBlockElement = document.querySelector(targetBlock);
        if (targetBlockElement) {
            let headerItem = "";
            let headerItemHeight = 0;
            if (noHeader) {
                headerItem = "header.header";
                const headerElement = document.querySelector(headerItem);
                if (!headerElement.classList.contains("_header-scroll")) {
                    headerElement.style.cssText = `transition-duration: 0s;`;
                    headerElement.classList.add("_header-scroll");
                    headerItemHeight = headerElement.offsetHeight;
                    headerElement.classList.remove("_header-scroll");
                    setTimeout((() => {
                        headerElement.style.cssText = ``;
                    }), 0);
                } else headerItemHeight = headerElement.offsetHeight;
            }
            let options = {
                speedAsDuration: true,
                speed,
                header: headerItem,
                offset: offsetTop,
                easing: "easeOutQuad"
            };
            document.documentElement.classList.contains("menu-open") ? functions_menuClose() : null;
            if (typeof SmoothScroll !== "undefined") (new SmoothScroll).animateScroll(targetBlockElement, "", options); else {
                let targetBlockElementPosition = targetBlockElement.getBoundingClientRect().top + scrollY;
                targetBlockElementPosition = headerItemHeight ? targetBlockElementPosition - headerItemHeight : targetBlockElementPosition;
                targetBlockElementPosition = offsetTop ? targetBlockElementPosition - offsetTop : targetBlockElementPosition;
                window.scrollTo({
                    top: targetBlockElementPosition,
                    behavior: "smooth"
                });
            }
            FLS(`[gotoBlock]: Юхуу...едем к ${targetBlock}`);
        } else FLS(`[gotoBlock]: Ой ой..Такого блока нет на странице: ${targetBlock}`);
    };
    function formFieldsInit(options = {
        viewPass: false,
        autoHeight: false
    }) {
        document.body.addEventListener("focusin", (function(e) {
            const targetElement = e.target;
            if (targetElement.tagName === "INPUT" || targetElement.tagName === "TEXTAREA") {
                if (!targetElement.hasAttribute("data-no-focus-classes")) {
                    targetElement.classList.add("_form-focus");
                    targetElement.parentElement.classList.add("_form-focus");
                }
                formValidate.removeError(targetElement);
                targetElement.hasAttribute("data-validate") ? formValidate.removeError(targetElement) : null;
            }
        }));
        document.body.addEventListener("focusout", (function(e) {
            const targetElement = e.target;
            if (targetElement.tagName === "INPUT" || targetElement.tagName === "TEXTAREA") {
                if (!targetElement.hasAttribute("data-no-focus-classes")) {
                    targetElement.classList.remove("_form-focus");
                    targetElement.parentElement.classList.remove("_form-focus");
                }
                targetElement.hasAttribute("data-validate") ? formValidate.validateInput(targetElement) : null;
            }
        }));
        if (options.viewPass) document.addEventListener("click", (function(e) {
            let targetElement = e.target;
            if (targetElement.closest('[class*="__viewpass"]')) {
                let inputType = targetElement.classList.contains("_viewpass-active") ? "password" : "text";
                targetElement.parentElement.querySelector("input").setAttribute("type", inputType);
                targetElement.classList.toggle("_viewpass-active");
            }
        }));
        if (options.autoHeight) {
            const textareas = document.querySelectorAll("textarea[data-autoheight]");
            if (textareas.length) {
                textareas.forEach((textarea => {
                    const startHeight = textarea.hasAttribute("data-autoheight-min") ? Number(textarea.dataset.autoheightMin) : Number(textarea.offsetHeight);
                    const maxHeight = textarea.hasAttribute("data-autoheight-max") ? Number(textarea.dataset.autoheightMax) : 1 / 0;
                    setHeight(textarea, Math.min(startHeight, maxHeight));
                    textarea.addEventListener("input", (() => {
                        if (textarea.scrollHeight > startHeight) {
                            textarea.style.height = `auto`;
                            setHeight(textarea, Math.min(Math.max(textarea.scrollHeight, startHeight), maxHeight));
                        }
                    }));
                }));
                function setHeight(textarea, height) {
                    textarea.style.height = `${height}px`;
                }
            }
        }
    }
    let formValidate = {
        getErrors(form) {
            let error = 0;
            let formRequiredItems = form.querySelectorAll("*[data-required]");
            if (formRequiredItems.length) formRequiredItems.forEach((formRequiredItem => {
                if ((formRequiredItem.offsetParent !== null || formRequiredItem.tagName === "SELECT") && !formRequiredItem.disabled) error += this.validateInput(formRequiredItem);
            }));
            return error;
        },
        validateInput(formRequiredItem) {
            let error = 0;
            if (formRequiredItem.dataset.required === "email") {
                formRequiredItem.value = formRequiredItem.value.replace(" ", "");
                if (this.emailTest(formRequiredItem)) {
                    this.addError(formRequiredItem);
                    error++;
                } else this.removeError(formRequiredItem);
            } else if (formRequiredItem.type === "checkbox" && !formRequiredItem.checked) {
                this.addError(formRequiredItem);
                error++;
            } else if (!formRequiredItem.value.trim()) {
                this.addError(formRequiredItem);
                error++;
            } else this.removeError(formRequiredItem);
            return error;
        },
        addError(formRequiredItem) {
            formRequiredItem.classList.add("_form-error");
            formRequiredItem.parentElement.classList.add("_form-error");
            let inputError = formRequiredItem.parentElement.querySelector(".form__error");
            if (inputError) formRequiredItem.parentElement.removeChild(inputError);
            if (formRequiredItem.dataset.error) formRequiredItem.parentElement.insertAdjacentHTML("beforeend", `<div class="form__error">${formRequiredItem.dataset.error}</div>`);
        },
        removeError(formRequiredItem) {
            formRequiredItem.classList.remove("_form-error");
            formRequiredItem.parentElement.classList.remove("_form-error");
            if (formRequiredItem.parentElement.querySelector(".form__error")) formRequiredItem.parentElement.removeChild(formRequiredItem.parentElement.querySelector(".form__error"));
        },
        formClean(form) {
            form.reset();
            setTimeout((() => {
                let inputs = form.querySelectorAll("input,textarea");
                for (let index = 0; index < inputs.length; index++) {
                    const el = inputs[index];
                    el.parentElement.classList.remove("_form-focus");
                    el.classList.remove("_form-focus");
                    formValidate.removeError(el);
                }
                let checkboxes = form.querySelectorAll(".checkbox__input");
                if (checkboxes.length > 0) for (let index = 0; index < checkboxes.length; index++) {
                    const checkbox = checkboxes[index];
                    checkbox.checked = false;
                }
                if (modules_flsModules.select) {
                    let selects = form.querySelectorAll(".select");
                    if (selects.length) for (let index = 0; index < selects.length; index++) {
                        const select = selects[index].querySelector("select");
                        modules_flsModules.select.selectBuild(select);
                    }
                }
            }), 0);
        },
        emailTest(formRequiredItem) {
            return !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,8})+$/.test(formRequiredItem.value);
        }
    };
    function formSubmit() {
        const forms = document.forms;
        if (forms.length) for (const form of forms) {
            form.addEventListener("submit", (function(e) {
                const form = e.target;
                formSubmitAction(form, e);
            }));
            form.addEventListener("reset", (function(e) {
                const form = e.target;
                formValidate.formClean(form);
            }));
        }
        async function formSubmitAction(form, e) {
            const error = !form.hasAttribute("data-no-validate") ? formValidate.getErrors(form) : 0;
            if (error === 0) {
                const ajax = form.hasAttribute("data-ajax");
                if (ajax) {
                    e.preventDefault();
                    const formAction = form.getAttribute("action") ? form.getAttribute("action").trim() : "#";
                    const formMethod = form.getAttribute("method") ? form.getAttribute("method").trim() : "GET";
                    const formData = new FormData(form);
                    form.classList.add("_sending");
                    const response = await fetch(formAction, {
                        method: formMethod,
                        body: formData
                    });
                    if (response.ok) {
                        let responseResult = await response.json();
                        form.classList.remove("_sending");
                        formSent(form, responseResult);
                    } else {
                        alert("Ошибка");
                        form.classList.remove("_sending");
                    }
                } else if (form.hasAttribute("data-dev")) {
                    e.preventDefault();
                    formSent(form);
                }
            } else {
                e.preventDefault();
                if (form.querySelector("._form-error") && form.hasAttribute("data-goto-error")) {
                    const formGoToErrorClass = form.dataset.gotoError ? form.dataset.gotoError : "._form-error";
                    gotoblock_gotoBlock(formGoToErrorClass, true, 1e3);
                }
            }
        }
        function formSent(form, responseResult = ``) {
            document.dispatchEvent(new CustomEvent("formSent", {
                detail: {
                    form
                }
            }));
            setTimeout((() => {
                if (modules_flsModules.popup) {
                    const popup = form.dataset.popupMessage;
                    popup ? modules_flsModules.popup.open(popup) : null;
                }
            }), 0);
            formValidate.formClean(form);
            formLogging(`Форма отправлена!`);
        }
        function formLogging(message) {
            FLS(`[Формы]: ${message}`);
        }
    }
    let addWindowScrollEvent = false;
    setTimeout((() => {
        if (addWindowScrollEvent) {
            let windowScroll = new Event("windowScroll");
            window.addEventListener("scroll", (function(e) {
                document.dispatchEvent(windowScroll);
            }));
        }
    }), 0);
    const langArr = {
        unit: {
            ru: "Чай",
            en: "Tea"
        },
        "tea-black": {
            ru: "Чёрный",
            en: "Black"
        },
        "tea-green": {
            ru: "Зелёный",
            en: "Green"
        },
        "tea-white": {
            ru: "Белый",
            en: "White"
        },
        "tea-oolong": {
            ru: "Оолонг",
            en: "Оolong"
        },
        "tea-puerh": {
            ru: "Пуэр",
            en: "Pu-erh"
        },
        title: {
            ru: "Чашка чая - это момент спокойствия в хаосе жизни",
            en: "A cup of tea is a moment of calm in the chaos of life"
        },
        text: {
            ru: "Широкий выбор высококачественных чаев со всего мира, тщательно отобранных чайными экспертами.",
            en: "Wide selection of high-quality teas from all over the world, carefully curated by tea experts."
        },
        blockquote: {
            ru: '"Чай - это не просто напиток, это образ жизни и способ общения с близкими."',
            en: '"Tea is not just a drink, it\'s a way of life and a way to connect with our loved ones."'
        },
        collections: {
            ru: "Ознакомьтесь с нашими коллекциями",
            en: "Explore our Collections"
        },
        feedback: {
            ru: "Что говорят наши клиенты",
            en: "What our Clients say"
        },
        "feedback-01": {
            ru: '"Как любитель чая, я пробовал чаи со всего мира, но этот чайный магазин действительно выделяется. Их чаи отличаются высочайшим качеством, а разнообразие впечатляет. Это определенно чайный магазин, который должен посетить каждый любитель чая."',
            en: '"As a tea enthusiast, I have tried teas from all over the world, but this tea store truly stands out. Their teas are of the highest quality and the variety is impressive. This is definitely a tea store that every tea lover should visit."'
        },
        "feedback-02": {
            ru: '"Этот чайный магазин - моя палочка-выручалочка для всех моих чайных потребностей. Их выбор непревзойденный, а качество чая - исключительное."',
            en: '"This tea store is my go-to for all my tea needs. Their selection is unbeatable and the quality of their teas is exceptional."'
        },
        "feedback-03": {
            ru: '"Если вы любите чай, вам обязательно нужно посетить этот чайный магазин. Здесь огромный выбор и превосходное качество. Я гарантирую, что вы не будете разочарованы."',
            en: "\"If you're a tea lover, you must visit this tea store. The selection is vast and the quality is outstanding. I guarantee you won't be disappointed.\""
        },
        "feedback-04": {
            ru: '"Я не большой любитель чая, но этот чайный магазин обратил меня в свою веру. Я очень рекомендую этот чайный магазин всем, кто ищет высококачественный чай."',
            en: '"I am not a big tea drinker, but this tea store has converted me. I highly recommend this tea store to anyone looking for a high-quality tea experience."'
        },
        blog: {
            ru: "Наш чайный блог",
            en: "Our Tea Blog"
        },
        "blog-title-01": {
            ru: "Путешествия за чаем: Забавные моменты со всего мира",
            en: "Tea Time Travels: Funny Moments from Around the World"
        },
        "blog-title-02": {
            ru: "Роль чая в поддержании психического здоровья",
            en: "The Role of Tea in Mental Health"
        },
        "blog-title-03": {
            ru: "Чайные сказки: Веселые истории от любителей чая",
            en: "Tea-rific Tales: Hilarious Stories from Tea Lovers"
        },
        "blog-title-04": {
            ru: "Чай и кофеин: Влияние на мозг и поведение",
            en: "Tea and Caffeine: Effects on the Brain and Behavior"
        },
        "blog-link": {
            ru: "Читать",
            en: "Read"
        },
        "blog-button": {
            ru: "Смотреть все",
            en: "View all"
        },
        "more-title": {
            ru: "Хотите узнать больше?",
            en: "Want to know more?"
        },
        "more-text": {
            ru: "Присоединяйтесь к нашей рассылке и будьте в курсе последних новостей, акций и эксклюзивных предложений от нашего чайного магазина. Узнайте первыми о новых поступлениях чая, сезонных купажах и специальных скидках. Не пропустите чайные преимущества - подпишитесь сегодня!",
            en: "Join our mailing list and stay up-to-date with the latest news, promotions, and exclusive offers from our tea store. Be the first to know about new tea arrivals, seasonal blends, and special discounts. Don't miss out on the tea-rrific perks - sign up today!"
        },
        "checkbox-text": {
            ru: "Мы серьезно относимся к вашей конфиденциальности и обязуемся защищать вашу личную информацию. Подписываясь на нашу рассылку, вы соглашаетесь получать от нас периодические электронные письма о нашей продукции, акциях и другой информации, связанной с чаем.",
            en: "We take your privacy seriously and are committed to protecting your personal information. By subscribing to our mailing list, you are consenting to receive periodic emails from us about our products, promotions, and other tea-related information."
        },
        "prioritise-title": {
            ru: "Наши приоритеты",
            en: "We Prioritise"
        },
        "prioritise-title-01": {
            ru: "Чай из одного сада",
            en: "Single garden teas"
        },
        "prioritise-title-02": {
            ru: "Только листовой чай",
            en: "Only Loose leaf tea"
        },
        "prioritise-title-03": {
            ru: "Поддержка клиентов",
            en: "Customer support"
        },
        "prioritise-title-04": {
            ru: "Быстрая доставка",
            en: "Fast shipping"
        },
        "prioritise-subtitle-01": {
            ru: "Полная прозрачность",
            en: "Complete transparency"
        },
        "prioritise-subtitle-02": {
            ru: "Лучший опыт питья",
            en: "Best Drinking Experience"
        },
        "prioritise-subtitle-03": {
            ru: "Никаких ботов и автоматических ответов",
            en: "No bots, no automated replies"
        },
        "prioritise-subtitle-04": {
            ru: "Экономия, удобство, надежность",
            en: "Save, Convenient, Reliable"
        },
        "spollers-title-01": {
            ru: "Продукция",
            en: "Products"
        },
        "spollers-title-02": {
            ru: "Компания",
            en: "Company"
        },
        "spollers-1-item-01": {
            ru: "Чёрный чай",
            en: "Black tea"
        },
        "spollers-1-item-02": {
            ru: "Зелёный чай",
            en: "Green tea"
        },
        "spollers-1-item-03": {
            ru: "Белый чай",
            en: "White tea"
        },
        "spollers-1-item-04": {
            ru: "Оолонг чай",
            en: "Oolong tea"
        },
        "spollers-1-item-05": {
            ru: "Пуэр чай",
            en: "Pu-erh tea"
        },
        "spollers-2-item-01": {
            ru: "О нас",
            en: "About Us"
        },
        "spollers-2-item-02": {
            ru: "Наши контакты",
            en: "Contact Us"
        },
        "spollers-2-item-03": {
            ru: "Наш блог",
            en: "Our Blog"
        },
        "spollers-2-item-04": {
            ru: "FAQ",
            en: "FAQ"
        },
        "spollers-2-item-05": {
            ru: "Перевозка и доставка",
            en: "Shipping & Delivery"
        },
        "spollers-2-item-06": {
            ru: "Политика возврата",
            en: "Refund policy"
        },
        "spollers-2-item-07": {
            ru: "Условия обслуживания",
            en: "Terms of Service"
        },
        "footer-blockquote": {
            ru: '"Чай - это путешествие. Он может перенести вас в новые места и открыть ваш разум для новых впечатлений. Пусть каждый глоток перенесет вас в мир чудес и возможностей"',
            en: '"Tea is a journey. It can take you to new places and open your mind to new experiences. Let every sip transport you to a world of wonder and possibility"'
        },
        "footer-blockquote-author": {
            ru: "Драгомир Теодореску, владелец Tealuxe",
            en: "Dragomir Teodorescu, Tealuxe owner"
        },
        "connection-title": {
            ru: "Будьте на связи",
            en: "Stay In Touch"
        },
        "connection-text": {
            ru: "Пожалуйста, свяжитесь с нами по электронной почте или по телефону. Мы будем рады услышать вас!",
            en: "Please feel free to contact us via the email of phone. We would be happy to hear from you!"
        }
    };
    const langButtons = document.querySelectorAll(".lang-btn");
    const allLang = [ "en", "ru" ];
    langButtons.forEach((button => {
        button.addEventListener("click", (function() {
            const lang = this.getAttribute("data-lang");
            changeLanguage(lang);
        }));
    }));
    function changeLanguage(lang) {
        if (!allLang.includes(lang)) return;
        location.href = window.location.pathname + "#" + lang;
        location.reload();
    }
    function setInitialLanguage() {
        const hash = window.location.hash.substr(1);
        if (!allLang.includes(hash)) {
            location.href = window.location.pathname + "#ru";
            location.reload();
        }
        document.querySelector("title").innerHTML = langArr["unit"][hash];
        for (let key in langArr) {
            let elems = document.querySelectorAll(".lng-" + key);
            elems.forEach((function(elem) {
                elem.innerHTML = langArr[key][hash];
            }));
        }
        langButtons.forEach((button => {
            const lang = button.getAttribute("data-lang");
            if (lang === hash) button.style.display = "none";
        }));
    }
    setInitialLanguage();
    document.addEventListener("DOMContentLoaded", (() => {
        const listItems = document.querySelectorAll(".collections__item");
        listItems.forEach((item => {
            const link = item.querySelector(".collections__link");
            const image = item.querySelector(".collections__image img");
            link.addEventListener("mouseover", (() => {
                image.style.transform = "scale(1.04)";
            }));
            link.addEventListener("mouseout", (() => {
                image.style.transform = "scale(1)";
            }));
        }));
    }));
    window["FLS"] = true;
    isWebp();
    menuInit();
    spollers();
    formFieldsInit({
        viewPass: false,
        autoHeight: false
    });
    formSubmit();
})();