
    var tabel = document.getElementById('tabel'),
        form = document.getElementById('frmUtama'),
        nim = document.getElementById('nim'),
        nama = document.getElementById('nama'),
        tanggalLahir = document.getElementById('tanggalLahir'),
        ipk = document.getElementById('ipk'),
        hapusData = document.getElementById('hapusData');
        
    buatDatabase();
    form.addEventListener('submit', tambahBaris);                  
    tabel.addEventListener('click', hapusBaris);
    hapusData.addEventListener('click', clearData);
    
    function buatDatabase() {
        if (!('indexedDB' in window)) {
            alert('Web Browser Anda tidak mendukung IndexedDB');
            return;
        }	
        var request = window.indexedDB.open('latihan', 1);
        request.onerror = kesalahanHandler;
        request.onupgradeneeded = function(e) {             
            var db = e.target.result;
            db.onerror = kesalahanHandler;                          
            var objectstore = db.createObjectStore('mahasiswa', { keyPath: 'nim' });
            console.log('Object store mahasiswa berhasil dibuat.');
        }
        request.onsuccess = function(e) {           
            db = e.target.result;
            db.onerror = kesalahanHandler;                          
            console.log('Berhasil melakukan koneksi ke database lokal.');
            bacaDariDatabase();
        }
    }
    
    function kesalahanHandler(e) {
      console.log('Error Database: ' + e.target.errorCode);      
    }
    
    function tambahBaris(e) {
          // Periksa apakah NIM sudah ada
          if (tabel.rows.namedItem(nim.value)) {
              alert('Error: Nim sudah terdaftar!');
              e.preventDefault();
              return;
          }
          // Tambah ke database
          tambahKeDatabase({
              nim: nim.value,
              nama: nama.value,
              tanggalLahir: tanggalLahir.value,
              ipk: ipk.value
          });
          // Membuat baris baru
          var baris = tabel.insertRow();
          baris.id = nim.value;
          baris.insertCell().appendChild(document.createTextNode(nim.value));
          baris.insertCell().appendChild(document.createTextNode(nama.value));
          baris.insertCell().appendChild(document.createTextNode(tanggalLahir.value));
          baris.insertCell().appendChild(document.createTextNode(ipk.value));
    
          // Membuat tombol hapus 
          var btnHapus = document.createElement('input');
          btnHapus.type = 'button';
          btnHapus.value = 'Hapus';
          btnHapus.id = nim.value;
          baris.insertCell().appendChild(btnHapus);
          e.preventDefault();
    }
                  
    function tambahKeDatabase(mahasiswa) {      
        var objectstore = buatTransaksi().objectStore('mahasiswa');
        var request = objectstore.add(mahasiswa);
        request.onerror = kesalahanHandler;
        request.onsuccess = console.log('Mahasiswa [' + mahasiswa.nim + '] telah ditambahkan ke database lokal.');            
    }
    
    function hapusBaris(e) {
        if (e.target.type=='button') {                
            var hapus = confirm('Delete Record?');
            if(hapus)
            {	tabel.deleteRow(tabel.rows.namedItem(e.target.id).sectionRowIndex);
                hapusDariDatabase(e.target.id);
            }
        }
    }
    // Hapus record dari database
    
    function hapusDariDatabase(nim) {
        var objectstore = buatTransaksi().objectStore('mahasiswa');
        var request = objectstore.delete(nim);
        request.onerror = kesalahanHandler;
        request.onsuccess = console.log('Mahasiswa [' + nim + '] berhasil dihapus dari database lokal.');
    }
    
    function buatTransaksi() {
        var transaction = db.transaction(['mahasiswa'], 'readwrite');
        transaction.onerror = kesalahanHandler;
        transaction.oncomplete = console.log('Transaksi baru saja diselesaikan.');                  
        return transaction;
    }
    
    // Menampilkan dari database
    function bacaDariDatabase() {
        var objectstore = buatTransaksi().objectStore('mahasiswa');
        objectstore.openCursor().onsuccess = function(e) {
            var result = e.target.result;
            if (result) {
                console.log('Membaca mahasiswa [' + result.value.nim + '] dari database.');
                var baris = tabel.insertRow();                  
                baris.id = result.value.nim;
                baris.insertCell().appendChild(document.createTextNode(result.value.nim));
                baris.insertCell().appendChild(document.createTextNode(result.value.nama));
                baris.insertCell().appendChild(document.createTextNode(result.value.tanggalLahir));
                baris.insertCell().appendChild(document.createTextNode(result.value.ipk));
                var btnHapus = document.createElement('input');
                btnHapus.type = 'button';
                btnHapus.value = 'Hapus';
                btnHapus.id = result.value.nim;         
                baris.insertCell().appendChild(btnHapus);
                result.continue();
            }
        }   
    }
    
    // Menghapus ObjectStore dari database IndexedDB
    function clearData() {
        var DBOpenRequest = window.indexedDB.open("latihan", 1);
        DBOpenRequest.onsuccess = function(e) {
            console.log('Database terbuka.');
            db = DBOpenRequest.result;
            var transaction = db.transaction(["mahasiswa"], "readwrite");
            transaction.oncomplete = function(e) {
                console.log('Transaksi komplit.');
            };
            transaction.onerror = function(e) {
                console.log('Transaksi error: ' + transaction.error);
            };
            var objectStore = transaction.objectStore("mahasiswa");
            var objectStoreRequest = objectStore.clear();
            objectStoreRequest.onsuccess = function(e) {
                console.log('Request hapus data telah sukses.');
            };
            location.reload();
        };
    }
