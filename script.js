function toggleStar(checkbox) {
    checkbox.querySelector('input[type="checkbox"]').checked = !checkbox.querySelector('input[type="checkbox"]').checked;
}
function openModal() {
    document.getElementById('overlay').style.display = 'block';
    document.getElementById('modal').style.display = 'block';
}

function closeModal() {
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('modal').style.display = 'none';
}