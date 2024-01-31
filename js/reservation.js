
    var mySwiper = new Swiper('.swiper-container', {
      loop: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
    });
  
    flatpickr("#date", {
      enableTime: false,
      altInput: true,
      altFormat: "F j, Y",
      dateFormat: "Y-m-d",
      minDate: "today",
    });
  
    flatpickr("#startTime, #endTime", {
      enableTime: true,
      noCalendar: true,
      dateFormat: "H:i",
    });
  
    function openBookingModal() {
      document.getElementById('bookingModal').style.display = 'block';
    }
  
    function closeBookingModal() {
      document.getElementById('bookingModal').style.display = 'none';
    }
  
    function displayExistingBookings() {
      const pageSize = 12; 
      let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
  
      const today = moment().startOf('day');
      bookings = bookings.filter(booking => moment(booking.date).isSameOrAfter(today));
      const existingBookingsList = document.getElementById('existingBookingsList');
      existingBookingsList.innerHTML = '';
  
      const totalPages = Math.ceil(bookings.length / pageSize);
  
      function displayBookings(page) {
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
  
        existingBookingsList.innerHTML = '';
  
        bookings.slice(start, end).forEach(booking => {
          const listItem = document.createElement('tr');
          listItem.innerHTML = `<td>${booking.date}</td><td>${booking.startTime} - ${booking.endTime}</td>`;
          existingBookingsList.appendChild(listItem);
        });
      }
  
      displayBookings(1);
  
      const pagination = document.getElementById('pagination');
      pagination.innerHTML = '';
      for (let page = 1; page <= totalPages; page++) {
        const pageLink = document.createElement('span');
        pageLink.classList.add('page-link');
        pageLink.textContent = page;
        pageLink.onclick = () => {
          document.querySelectorAll('.page-link').forEach(link => link.classList.remove('active'));
          pageLink.classList.add('active');
          displayBookings(page);
        };
        pagination.appendChild(pageLink);
      }
    }
  
    window.onload = function () {
      displayExistingBookings();
    };
  
    function bookStudio() {
      const date = document.getElementById('date').value;
      const startTime = document.getElementById('startTime').value;
      const endTime = document.getElementById('endTime').value;
      const name = document.getElementById('name').value;
      const prepayment = document.getElementById('prepayment').value;
  
      const bookingData = {
        date: date,
        startTime: startTime,
        endTime: endTime,
        name: name,
        prepayment: prepayment
      };
  
      let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
  
      const isAlreadyBooked = bookings.some(booking =>
        booking.date === date &&
        ((booking.startTime <= startTime && startTime < booking.endTime) ||
          (booking.startTime < endTime && endTime <= booking.endTime))
      );
  
      const existingBookingsList = document.getElementById('existingBookingsList');
  
      if (isAlreadyBooked) {
        alert('Зал уже занят в выбранное время. Выберите другое время.');
      } else {
        bookings.push(bookingData);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        alert('Зал успешно забронирован!');
      }
  
      displayExistingBookings();
    }
  
    function prevPage() {
      const currentPage = document.querySelector('.page-link.active');
      if (currentPage && currentPage.previousElementSibling) {
        currentPage.previousElementSibling.click();
      }
    }
  
    function nextPage() {
      const currentPage = document.querySelector('.page-link.active');
      if (currentPage && currentPage.nextElementSibling) {
        currentPage.nextElementSibling.click();
      }
    }
