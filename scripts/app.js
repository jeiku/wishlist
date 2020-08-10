let giftID = 0;
const giftList = document.getElementById("gift-list");
const giftItems = [...document.getElementsByClassName("gift-item")];

// gift Class: Represents a gift
class Gift {
	constructor(name, where, price, id) {
		this.name = name;
		this.where = where;
		this.price = price;
		this.id = id;
	}
}

// UI Class: Handle UI Tasks
class UI {
	static displayGifts() {
		const gifts = Store.getGifts();

		gifts.forEach((gift) => UI.addGiftToList(gift));
	}

	static addGiftToList(gift) {
		const list = document.getElementById("gift-list");
		const row = document.createElement("tr");
		row.classList.add("text-white", "gift-item");
		row.dataset.index = gift.id;
		console.log("index appended to the row: ");
		console.log(row.dataset.index);
		row.innerHTML = `
            <td>${gift.name}</td>
            <td>${gift.where}</td>
            <td>$${gift.price}</td>
            <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>`;

		list.appendChild(row);
	}

	static deleteGift(el) {
		if (giftList.firstChild) {
			if (el.classList.contains("delete")) {
				el.parentElement.parentElement.remove();
			}
		} else {
			giftID = 0;
		}
	}

	static removeAll() {
		const giftList = document.getElementById("gift-list");
		const giftItems = [...document.getElementsByClassName("gift-item")];
		if (giftList.firstChild) {
			giftItems.forEach((item) => item.remove());
			giftID = 0;
		}
	}

	static getLastId() {
		const giftList = document.getElementById("gift-list");
		if (giftID >= 1) {
			let id;
			const giftItems = document.getElementsByClassName("gift-item");
			if (giftItems[0]) {
				id = giftItems[giftItems.length - 1].dataset.index;
			} else {
				id = 0;
			}
			return id;
		} else {
			return 0;
		}
	}

	static showAlert(message, className) {
		const div = document.createElement("div");
		div.className = `alert alert-${className}`;
		div.appendChild(document.createTextNode(message));
		const container = document.querySelector(".container");
		const form = document.getElementById("gift-form");
		container.insertBefore(div, form);

		// Vanish in 2 seconds
		setTimeout(() => document.querySelector(".alert").remove(), 3000);
	}
}
// Store Class: Handles Storage
class Store {
	static getGifts() {
		let gifts;
		if (localStorage.getItem("gifts") === null) {
			gifts = [];
		} else {
			// stored as a string, so need to run it through a JSON.parse method, so can
			// use it as regular javascript array
			gifts = JSON.parse(localStorage.getItem("gifts"));
		}

		return gifts;
	}

	static addGift(gift) {
		const gifts = Store.getGifts();
		// console.log("Gift being pushed into memory: ");
		// console.log(gift);
		gifts.push(gift);
		//need to make it a string
		localStorage.setItem("gifts", JSON.stringify(gifts));
	}

	static removeGift(id) {
		const gifts = Store.getGifts();
		gifts.forEach((gift, index) => {
			if (gift.id === id) {
				gifts.splice(index, 1);
			}
		});

		localStorage.setItem("gifts", JSON.stringify(gifts));
	}

	static removeAllGifts() {
		const gifts = Store.getGifts();
		gifts.length = 0;
		localStorage.setItem("gifts", JSON.stringify(gifts));
	}
}

// Event: Display gifts
document.addEventListener("DOMContentLoaded", UI.displayGifts);

// Event: Add a gift
document.getElementById("gift-form").addEventListener("submit", (e) => {
	e.preventDefault();

	// Get form values
	const name = document.getElementById("name").value;
	const where = document.getElementById("where").value;
	const price = document.getElementById("price").value;
	let id = UI.getLastId();
	id++;
	giftID++;
	// Validate
	if (name === "" || where === "" || price === "") {
		UI.showAlert("Please fill in all fields!", "danger");
	} else {
		// Instantiate gift
		const gift = new Gift(name, where, price, id);

		// Add gift to UI
		UI.addGiftToList(gift);
		// Add gift to store
		Store.addGift(gift);

		// Show success message
		UI.showAlert("Gift added to your list", "success");

		// Clear Fields
		document.getElementById("gift-form").reset();
	}
});

// Event: Remove a gift
document.getElementById("gift-list").addEventListener("click", (e) => {
	if (e.target.classList.contains("delete")) {
		if (confirm("Delete this item?")) {
			// Remove gift from UI
			UI.deleteGift(e.target);

			// Remove gift from store
			Store.removeGift(
				parseInt(e.target.parentElement.parentElement.dataset.index)
			);

			// Show success message
			UI.showAlert("Gift removed", "success");
		}
	}
});

// Event: Remove all
document.getElementById("clear-list").addEventListener("click", () => {
	if (confirm("Delete all items?")) {
		// Remove all gifts from the UI
		UI.removeAll();

		// Remove all gift from store
		Store.removeAllGifts();

		// Show success message
		UI.showAlert("All gifts removed", "success");
	}
});

document.getElementById("print").addEventListener("click", () => {
	window.print();
});

// <!DOCTYPE html>
// <html>
// <head>
// <script>
// function clickCounter() {
// if(typeof(Storage) !== "undefined") {
//     if (localStorage.lickcount) {
//     localStorage.lickcount = Number(localStorage.lickcount)+1;
//     } else {
//     localStorage.lickcount = 1;
//     }
//     document.getElementById("result").innerHTML = "You have clicked the button " + localStorage.lickcount + " time(s).";
// } else {
//     document.getElementById("result").innerHTML = "Sorry, your browser does not support web storage...";
// }
// }
// </script>
// </head>
// <body>

// <p><button onclick="clickCounter()" type="button">Click me!</button></p>
// <div id="result"></div>
// <p>Click the button to see the counter increase.</p>
// <p>Close the browser tab (or window), and try again, and the counter will continue to count (is not reset).</p>

// </body>
// </html>
