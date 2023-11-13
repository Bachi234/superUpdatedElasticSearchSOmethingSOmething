var dataTable;
toastr.options = {
    closeButton: true,
    debug: false,
    newestOnTop: true,
    progressBar: true,
    positionClass: "toast-top-right",
    preventDuplicates: false,
    onclick: null,
    showDuration: "300",
    hideDuration: "1000",
    timeOut: "5000",
    extendedTimeOut: "1000",
};
$(document).ready(function () {
    try {
        // Initialize DataTable
        dataTable = $("#datatable-buttons").DataTable({
            scrollY: '100vh', // Enable vertical scrolling
            scrollX: true,    // Enable horizontal scrolling
            fixedHeader: true, // Fix the table header
            lengthChange: true,
            lengthMenu: [[100, 250, 500], [100, 250, 500]],
            pageLength: 100,
            autoWidth: true,
            dom: '<"row"<"col-md-6"B><"col-md-6"f>>rt<"row"<"col-md-6"l><"col-md-6"p>>',
            buttons: [
                {
                    extend: 'excelHtml5',
                    text: 'Excel',
                    className: 'btn btn-success btn-sm waves-effect waves-light',
                    filename: 'ElasticReport'
                },
                {
                    extend: 'pdfHtml5',
                    text: 'PDF',
                    className: 'btn btn-danger btn-sm waves-effect waves-light',
                    orientation: 'landscape',
                    pageSize: 'LETTER',
                    filename: 'ElasticReport'
                }
            ],
            language: {
                search: "Table Filter:"
            },
            // Callbacks to show/hide loading modal
            "preInit": function () {
                showLoadingModal();
            },
            "drawCallback": function () {
                hideLoadingModal();
            }
        }).buttons().container().appendTo("#datatable-buttons_wrapper .col-md-6:eq(0)");

        $(".dataTables_length select").addClass("form-select form-select-sm");
    } catch (error) {
        console.error("An error occurred:", error);
    }
});

// Scroll to the bottom of the table
$("#goToBottomBtn").click(function () {
    var tableBottom = $("#datatable-buttons").offset().top + $("#datatable-buttons").height();
    $("html, body").animate({ scrollTop: tableBottom }, 500);
});

// Return to Top button click event
$("#returnToTopBtn").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 500);
});

// Function to show the loading modal
function showLoadingModal() {
    var loadingModal = document.getElementById('ProgressModal');
    loadingModal.style.display = "block";
}

// Function to hide the loading modal
function hideLoadingModal() {
    var loadingModal = document.getElementById('ProgressModal');
    loadingModal.style.display = "none";
}


// --- SUBJECT FILTER ---
async function loadDataAndDisplayTable_() {
    try {
        showLoadingModal();

        var searchSubject = document.getElementById('startDateInput').value;
        var url = `/Home/DisplayElasticData?searchMailNumber=${searchSubject}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Log the received data to the console
        console.log('Received data:', data);

        // Update your table or do other processing here with the data
        console.log('Processed data:', data);

        hideLoadingModal();
        toastSuccess();
    } catch (error) {
        console.error('Error:', error);
        hideLoadingModal();
    }
}

// Add an event listener to the filter button to trigger data loading
document.getElementById('searchButton').addEventListener('click', loadDataAndDisplayTable_);


// --- DATE FILTER ---
async function loadDataAndDisplayTable() {
    try {
        showLoadingModal(); // Show the loading modal before the fetch request

        var startDate = document.getElementById('startDateInput').value;
        var endDate = document.getElementById('endDateInput').value;
        var url = '/Home/DisplayElasticData?startDate=' + startDate + '&endDate=' + endDate + '&filterButton=';

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Update your table or do other processing here with the data
        console.log(data);

        // Hide the loading modal after the data is loaded and displayed
        hideLoadingModal();
        toastSuccess();
    } catch (error) {
        console.error('Error:', error);
        /*toastr.warning("TestERROR");*/
        hideLoadingModal(); // Hide the loading modal in case of an error
    }
}
// Add an event listener to the filter button to trigger data loading
document.getElementById('filterButton').addEventListener('click', loadDataAndDisplayTable);
