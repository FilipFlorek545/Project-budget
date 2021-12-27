const init = () => {
    countBudget();
    everyMan();
}

const everyMan = () => {    //Ta funkcja przekazuje wartość inputów do funkcji ktora je dodaje
  
    
    const btn_income = document.getElementById('btn_add_income')
    const btn_expenses = document.getElementById('btn_add_expenses')
    btn_income.addEventListener('click', inputSorter)
    btn_expenses.addEventListener('click', inputSorter)
    // ta funkcja przypisuje przyciskom czy to wydatki czy przychod
    function inputSorter(event) {
        if(event.target.id === 'btn_add_income') {
            const type = document.querySelector('#left_table #przychody_rodzaj')
            const amount = document.querySelector('#left_table #przychody_kwota')
                const myMoney = new Money()
                myMoney.addItem(type.value, amount.value,event)
                type.value = null
                amount.value = null
            }
        else {
            const type = document.querySelector('#right_table #wydatki_rodzaj')
            const amount = document.querySelector('#right_table #wydatki_kwota')
                const myMoney = new Money()
                myMoney.addItem(type.value, amount.value,event)
                type.value = null
                amount.value = null
            }
    };
}

class Money {
    constructor(type, amount){
        this.type = String(type);
        this.amount = Number(amount);
    }
    addItem(type, amount, event){ //Funkcja dodająca nowe items do DOM
        if(amount && type){
            let uniqueId = Date.now();       
            let new_li = document.createElement('li')
            new_li.innerHTML = type + ' - ' + amount + ' zł';
            new_li.style.marginTop = '10px'
            new_li.style.marginBottom = '10px'
            new_li.dataset.amount = amount;
            new_li.dataset.title = type;
            new_li.id = 'ID' + uniqueId;
            //button that deletes
            let btn_delete = document.createElement('button');
            btn_delete.innerHTML = 'Usuń';
            btn_delete.style.float = 'right';
            btn_delete.style.marginRight = '10px';
            btn_delete.dataset.id = 'ID' + uniqueId;
            new_li.appendChild(btn_delete)
            btn_delete.addEventListener('click', this.removeItem)
            //button that edits
            let btn_edit = document.createElement('button');
            btn_edit.innerHTML = 'Edytuj';
            btn_edit.style.float = 'right';
            btn_edit.style.marginRight = '5px'
            btn_edit.dataset.id = 'ID' + uniqueId;
            new_li.appendChild(btn_edit)
            btn_edit.addEventListener('click',this.editItem)
            //podzial na to w ktorej tabeli wpisujemy 
                if(event.target.id === 'btn_add_income'){
                    btn_edit.setAttribute('class','btn_edit_income')
                    btn_delete.setAttribute('class','btn_delete_income')
                    let lista_przychody = document.querySelector('#lista_przychody')
                    lista_przychody.appendChild(new_li);
                    new_li.setAttribute('class','new_item_przychody');
                clearInput();
                let thisIsSadlyEssential = parseInt(new_li.dataset.amount,10)
                betterIncome = betterIncome + thisIsSadlyEssential;
                sumTheIncome(event);
            }
            else{
                btn_edit.setAttribute('class','btn_edit_expenses')
                btn_delete.setAttribute('class','btn_delete_expenses')
                let lista_wydatki = document.querySelector('#lista_wydatki')
                lista_wydatki.appendChild(new_li);
                new_li.setAttribute('class','new_item_wydatki');
                clearInput();
                let thisIsSadlyEssential_2 = parseInt(new_li.dataset.amount,10)
                betterExpenses = betterExpenses + thisIsSadlyEssential_2;
                sumTheIncome(event);
            }
        }
        else{
            alert('Proszę uzupełnić poprawnie tabelę!');
        }
    }
    editItem(event){  // funkcja ktora edytuje itemy
        if(event.target.className === 'btn_edit_income'){
            const itemId = event.target.dataset.id;
            const itemElement = document.querySelector('#' + itemId);
            let input_placement_type = document.querySelector('#przychody_rodzaj');
            input_placement_type.value = itemElement.dataset.title;
            let input_placement_amount = document.querySelector('#przychody_kwota');
            input_placement_amount.value = itemElement.dataset.amount;
            itemElement.parentNode.removeChild(itemElement);
            betterIncome = betterIncome - itemElement.dataset.amount;
            sumTheIncome(event);
        }
        else{
            const itemId = event.target.dataset.id;
            const itemElement = document.querySelector('#' + itemId);
            let input_placement_type = document.querySelector('#wydatki_rodzaj');
            input_placement_type.value = itemElement.dataset.title;
            let input_placement_amount = document.querySelector('#wydatki_kwota');
            input_placement_amount.value = itemElement.dataset.amount;
            itemElement.parentNode.removeChild(itemElement);
            betterExpenses = betterExpenses - itemElement.dataset.amount;
            sumTheIncome(event);
        }
    }
    removeItem(event){ //usuwam itemy
        const itemId = event.target.dataset.id;
        const itemElement = document.querySelector('#' + itemId);
        itemElement.parentNode.removeChild(itemElement);
        if(event.target.className === 'btn_delete_income'){
            betterIncome = betterIncome - itemElement.dataset.amount;
        }
        else{
            betterExpenses = betterExpenses - itemElement.dataset.amount
        }
        sumTheIncome(event);
    }
}
const clearInput = () => {   //Usuwam input
    let inputs = document.querySelectorAll("input");
    inputs.forEach((input) => (input.value = ""));
}

let betterIncome = '0';
let betterExpenses = '0';

// Myślałem też zeby zrobić to wieczną pętlą while, ale bałem się że spowolni stronę
const sumTheIncome = (event) => { //Podliczam wszystkie dodane wartości
    betterIncome = parseInt(betterIncome,10);
    betterExpenses = parseInt(betterExpenses,10);
    if(event.target.id === 'btn_add_income' || event.target.className === 'btn_edit_income' || event.target.className === 'btn_delete_income'){
        let superTotalIncome = document.getElementById('suma_przychodow')
        superTotalIncome.innerHTML = 'Suma twoich przychodów to: ' + betterIncome + ' PLN.'
    }
    else{
        let uberTotalIncome = document.getElementById('suma_wydatkow')
        uberTotalIncome.innerHTML = 'Suma twoich wydatków to: ' + betterExpenses + ' PLN.'
    }
    countBudget()
} 

const countBudget = (totalIncome,totalExpense) => { // Decyduję o headerze
    totalIncome = betterIncome;
    totalExpense = betterExpenses;
    let budget = totalIncome - totalExpense;
    if(budget > 0){
        document.getElementById('header').innerHTML ='Możesz wydać jeszcze ' + budget + ' złotych!'
    }
    else if(budget == 0){
        document.getElementById('header').innerHTML = "Bilans wynosi zero";
    }
    else if(budget < 0){
        document.getElementById('header').innerHTML ='Bilans jest ujemny. Jesteś na minusie ' + budget + ' złotych!'
    }
    else{
        document.getElementById('header').innerHTML ='Proszę uzupełnić tabelę :)'
    }
}

if (document.readyState !== "loading") {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init());
  }