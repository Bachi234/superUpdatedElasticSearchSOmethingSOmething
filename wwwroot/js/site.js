var dataTable;
$(document).ready(function () {
    try {
        // Initialize DataTable
            dataTable = $("#datatable-buttons").DataTable({
            scrollY: '100vh', // Enable vertical scrolling
            /*scrollX: true, */   // Enable horizontal scrolling
            fixedHeader: true, // Fix the table header
            lengthChange: true,
            lengthMenu: [[100, 250, 500], [100, 250, 500]],
            pageLength: 100,
            initComplete: function () {
                // fade in the table after datatables is fully initialized
                $('#datatableContainer0').delay(10).show();
            },
            /*autoWidth: true,*/
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
            columnDefs: [{
                targets: 0,
                orderable: false
            }],
            // Callbacks to show/hide loading modal
            "preInit": function () {
                showLoadingModal();
            },
            "drawCallback": function () {
                hideLoadingModal();
            }
        });
        setTimeout(function () {
            $($.fn.dataTable.tables(true)).DataTable().columns.adjust().draw();
        }, 10);
        // Display only Subject column outside the table for the first item
        //var firstItemSubject = '@Model.ElasticData.First().Subject';
        //if (firstItemSubject) {
        //    $("#firstItemSubject").text('First Item Subject: ' + firstItemSubject);
        //}

        // Include DataTable buttons in a separate div for better styling
        $('.dt-buttons').appendTo('.buttons-container');
        document.getElementById('searchButton').addEventListener('click', loadDataAndDisplayTable_);
        document.getElementById('filterButton').addEventListener('click', loadDataAndDisplayTable);

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
        showLoadingModal(); // Show loading modal before starting the fetch
     
        var searchSubject = document.getElementById('startDateInput').value;
        var url = `/Home/DisplayElasticData?searchMailNumber=${searchSubject}`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();

        // Update your table or do other processing here with the data
        console.log(data);

    } catch (error) {
        console.error('Error:', error);
        hideLoadingModal();
    }
    
}
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
    } catch (error) {
        console.error('Error:', error);
        hideLoadingModal(); // Hide the loading modal in case of an error
    }
}

// Add an event listener to the filter button to trigger data loading
//document.getElementById('searchButton').addEventListener('click', loadDataAndDisplayTable_);
//document.getElementById('filterButton').addEventListener('click', loadDataAndDisplayTable);

//document.getElementById('searchButton').removeEventListener('click', loadDataAndDisplayTable_);
//document.getElementById('filterButton').removeEventListener('click', loadDataAndDisplayTable);