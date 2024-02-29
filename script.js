function toggleStar(checkbox) {
    checkbox.querySelector('input[type="checkbox"]').checked = !checkbox.querySelector('input[type="checkbox"]').checked;
}
function openModal(modalNumber) {
    if(modalNumber==1){
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('modal-1').style.display = 'block';
    }else if(modalNumber==2){
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('modal-2').style.display = 'block';
    }
}

function closeModal(modalNumber) {
    if(modalNumber==1){
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('modal-1').style.display = 'none';
    }else if(modalNumber==2){
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('modal-2').style.display = 'none';
    }
}
