const pokemonRepository = (function () {
    const repository = [];
    let apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';
    let $pokemonList = $('ul');
    let $modalContainer = $('#modal-container');

    //Pulls all Pokemon data

    function getAll() {
        return repository;
    }

    //Pokemon profile details

    function showDetails(pokemon) {
        pokemonRepository.loadDetails(pokemon).then(function () {
            showModal(pokemon);
        });
    }

    //Adds character item to list (w/button and event listener)

    function addListItem(pokemon) {
        let $listItem = $('<li></li>');
        $pokemonList.append($listItem);
        let $button = $('<button class="menu-btn" data-toggle="modal">' + pokemon.name + '</button>');
        $($listItem).append($button);
        $button.on('click', function () {
            showDetails(pokemon);
        })
    }


    function loadList() {
        return $.ajax(apiUrl, {dataType: 'json'})
            .then(function (item) {
                $.each(item.results, function (index, item) {
                    let pokemon = {
                        name: item.name,
                        detailsUrl: item.url
                    };
                    add(pokemon);
                });
            }).catch(function (e) {
                console.error(e);
            })
    }

    function add(pokemon) {
        if (typeof pokemon === "object") {
            repository.push(pokemon);
        }
    }

    function loadDetails(item) {
        let url = item.detailsUrl;
        return $.ajax(url, {dataType: 'json'})
            .then(function (details) {
                item.imageUrl = details.sprites.front_default;
                item.height = details.height;
                item.types = "";
                Object.values(details.types).forEach(function (item2) {
                    item.types += (item.types.length !== 0 ? ", " : "") + item2.type.name;
                });
            }).catch(function (e) {
                console.error(e);
            });
    }

    function showModal(item) {
        //Clears everything out
        $modalContainer.html('');

        let $modal = $('<div></div>');
        $modal.addClass('modal');

        let $modalCloseButton = $('<button></button>');
        $modalCloseButton.addClass('modal-close');
        $modalCloseButton.text('Close');
        $modalCloseButton.on('click', hideModal);

        let $modalDetails = $('<p></p>');
        $modalDetails.text('They are ' + item.height / 10 + ' meters tall!');
        $modalDetails.addClass('modalSubDetails');

        let $modalName = $('<h2></h2>');
        $modalName.text(item.name);
        $modalName.addClass('modal-title');

        let $modalImg = $('<img>');
        $modalImg.attr('src', item.imageUrl);
        $modalImg.addClass('modal-img');

        let $modalSubDetails = $('<p></p>');
        $modalSubDetails.text('Types: ' + item.types);
        $modalSubDetails.addClass('modalSubDetails');

        $modal.append($modalCloseButton);
        $modal.append($modalName);
        $modal.append($modalImg);
        $modal.append($modalDetails);
        $modal.append($modalSubDetails);
        $modalContainer.append($modal);

        $modalContainer.addClass('is-visible');
    }

    function hideModal() {
        $modalContainer.removeClass('is-visible');
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && $modalContainer.hasClass('is-visible')) {
            hideModal();
        }
    });

    $modalContainer.on('click', (e) => {
        let target = e.target;
        if (target === $modalContainer) {
            hideModal();
        }
    });


    return {
        getAll: getAll,
        showDetails: showDetails,
        addListItem: addListItem,
        loadList: loadList,
        add: add,
        loadDetails: loadDetails,
        showModal: showModal
    };
})();

pokemonRepository.loadList().then(function () {
    pokemonRepository.getAll().forEach(function (pokemon) {
        pokemonRepository.addListItem(pokemon);
    });
});