// frontend/script.js

// Fetch and display items
fetch('/api/items')
  .then(res => res.json())
  .then(data => {
    const container = document.getElementById('items');
    if(container){
      container.innerHTML = '';
      data.forEach(item => {
        container.innerHTML += `
          <div class="item">
            <h3>${item.title}</h3>
            <p><strong>Description:</strong> ${item.description}</p>
            <p><strong>Contact:</strong> ${item.contact_info}</p>
            ${item.image_url ? `<img src="${item.image_url}" width="200" />` : ''}
            <p><button onclick="claimItem(${item.id})" ${item.claimed_by ? 'disabled' : ''}>${item.claimed_by ? 'Claimed' : 'Claim Item'}</button></p>
          </div>
        `;
      });
    }
  });

function claimItem(id) {
  fetch('/api/claim/' + id, { method: 'POST' })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      location.reload();
    });
}
