function checkWindowSize(){
    let width = window.innerWidth;

    if(width <= 600){
        smallBubble()
        smallLine()
        smallArea()
    } else if (width >= 600 && width < 1199){
       mediumBubble()
        mediumLine()
        mediumArea()
    
    } else if (width > 1200){
        largeLine()
        largeArea()
        largeBubble()
    }

} 


checkWindowSize()


// GIVING FUNCTONALITY TO OUR CUSTOM DROPDOWNS
// Attach click event listeners to each custom selector
customSelects.forEach(function (select) {
    let selectSelected = select.querySelector('.select-selected');
    let selectItems = select.querySelector('.select-items');
    let options = selectItems.querySelectorAll('div');

    // Toggle the dropdown visibility when the select box is clicked.
    selectSelected.addEventListener('click', function () {
        if (selectItems.style.display === 'block') {
            selectItems.style.display = 'none';
        } else {
            selectItems.style.display = 'block';
        }
    });

    // Set the selected option and hide the dropdown when an option is clicked
    options.forEach(function (option) {
        option.addEventListener('click', function () {
            selectSelected.textContent = option.textContent;
            selectItems.style.display = 'none';
        });
    });

    // Close the dropdown if the user clicks outside of it
    window.addEventListener('click', function (e) {
        if (!select.contains(e.target)) {
            selectItems.style.display = 'none';
        }
    });
});

