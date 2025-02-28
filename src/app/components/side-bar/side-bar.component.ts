import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExpensesService } from 'src/app/services/expenses.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-side-bar',
  templateUrl: './side-bar.component.html',
  styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent implements OnInit {
  @ViewChild('content') content: any;
  expenseForm!: FormGroup;
  isSubmitted = false;

  expenseData = {
    expenditure: '',
    name: '',
    date: '',
    category: ''
  };
  startDate: string = '';
  endDate: string = '';
  expensiveList = [];
  constructor(private fb: FormBuilder, private modalService: NgbModal,private expenseService: ExpensesService,private router: Router) {
   }
  isSidebarExpanded = false;
  switchScreen: number = 1;
  chartOptions: echarts.EChartsOption;
  barChartOptions:echarts.EChartsOption;
  ngOnInit(): void {
    this.expenseData = { name: '', category: '', expenditure: null, date: '' };
    this.getExpenses();
    this.filterExpenses();
  }

  onClickHome() {
    this.switchScreen = 1;
    this.getExpenses();
    this.prepareHomePage();
  }

  prepareHomePage() {
    if(this.expensiveList?.length > 0){
      var graphList = this.expensiveList.map(x => {
        return {
          value: x.expenditure,
          name: x.name
        }
      })
      this.chartOptions = 
      {
        tooltip: {
          trigger: 'item',
          textStyle: {
            color: '#fff', // Tooltip text color
          }
        },
        legend: {
          top: '3%',
          left: 'center',
          textStyle: {
            color: '#fff', // Tooltip text color
          }
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                color:'white',
                fontWeight: 'bold'
              }
            },
            labelLine: {
              show: false
            },
            data: graphList
          }
        ]
      };
    }
  }

  onClickDaily(){
     this.switchScreen=3;
     if (this.expensiveList?.length > 0) {
      // Mapping data for bar chart
      const barChartLabels = this.expensiveList.map(x => x.name);
      const barChartData = this.expensiveList.map(x => x.expenditure);

      // Bar Chart Configuration
      this.barChartOptions = {
        tooltip: { trigger: 'axis', textStyle: { color: '#fff' } },
        xAxis: {
          type: 'category',
          data: barChartLabels,
          axisLabel: { color: '#fff' }
        },
        yAxis: {
          type: 'value',
          axisLabel: { color: '#fff' }
        },
        series: [
          {
            name: 'Expenditure',
            type: 'bar',
            data: barChartData,
            itemStyle: {
              borderRadius: [5, 5, 0, 0], // Rounded corners for bars
              borderWidth: 1,
              borderType: 'solid',
              borderColor: '#73c0de',
              shadowColor: '#5470c6',
              shadowBlur: 3
            }
          }
        ]
      };
    }
}
    
filterExpenses(): void {
  if (!this.startDate || !this.endDate) {
    alert('Please select both start and end dates.');
    return;
}
this.onClickMonth(this.startDate, this.endDate);
}

onClickMonth(startDate: string, endDate: string) {
  this.switchScreen = 2;
  
  // Fetch expenses based on the selected date range
  this.expenseService.getExpensesByDateRange(startDate, endDate).subscribe(response => {
    this.expensiveList = response || []; // Ensure it's not undefined

    if (this.expensiveList.length > 0) {
      const graphList = this.expensiveList.map(x => ({
        value: x.expenditure,
        name: x.name
      }));

      this.chartOptions = {
        tooltip: {
          trigger: 'item',
          textStyle: { color: '#fff' } // Tooltip text color
        },
        legend: {
          top: '3%',
          left: 'center',
          textStyle: { color: '#fff' } // Legend text color
        },
        series: [
          {
            name: 'Expenditure Analysis',
            type: 'pie',
            radius: ['0', '50%'], // Donut shape
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderWidth: 2
            },
            label: { show: false, position: 'center' },
            emphasis: {
              label: {
                show: true,
                fontSize: 40,
                fontWeight: 'bold',
                color: 'white'
              }
            },
            labelLine: { show: false },
            data: graphList
          }
        ]
      };
    } else {
      // Handle empty data case
      this.chartOptions = {}; // Reset chart if no data is available
    }
  });
}  


  getExpenses(){
  const token = localStorage.getItem('token');
  if (token) {
    this.expenseService.getUserExpenses(token).subscribe((res) => {
      this.expensiveList = res;
      this.prepareHomePage();
    },(error) => {
      console.error('Error fetching tasks', error);
      // Optionally handle navigation if not authorized
      if (error.status === 401) {
        this.router.navigate(['/login']); // Redirect to login if token is invalid
      }
    });
  } 
  else {
    console.error('No userId or token found in local storage');
    this.router.navigate(['/login']); // Redirect to login if no userId or token
  }
    
  }

  addExpensive(content:any) {
    this.modalService.open(this.content, { centered: true, size: 'md' });
    this.isSubmitted = false; // Reset validation on modal open
    this.expenseData = { name: '', category: '', expenditure: null, date: '' };
  }

  deleteExpense(expenseId: number) {
    if (!expenseId) {
      console.error('Error: expenseId is undefined');
      return;
    }
  
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this expense!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
      background: '#222',
      color: '#fff'
    }).then((result) => {
      if (result.isConfirmed) {
        this.expenseService.deleteExpenseById(expenseId).subscribe({
          next: () => {
            Swal.fire({
              title: 'Deleted!',
              text: 'Your expense has been deleted.',
              icon: 'success',
              confirmButtonColor: '#3085d6',
              background: '#222',
              color: '#fff'
            });
  
            // Refresh expense list
            this.getExpenses();
          },
          error: (error) => {
            console.error('Error deleting expense:', error);
            Swal.fire({
              title: 'Error',
              text: 'Failed to delete the expense. Please try again.',
              icon: 'error',
              confirmButtonColor: '#d33',
              background: '#222',
              color: '#fff'
            });
          }
        });
      }
    }).catch((error) => console.error('Swal error:', error)); // Catch any Swal issues
  }

  onClickLogout(){
    this.router.navigate(['/welcome']);
  }


  onSubmit() {
    this.isSubmitted = true;
    
    this.expenseService.addExpense(this.expenseData).subscribe({
      next: () => {
        Swal.fire({
          title: 'Success',
          text: 'Expense added successfully',
          icon: 'success',
          confirmButtonText: 'OK!',
          allowOutsideClick: false,
          background: '#222', // Dark theme
          color: '#fff' // White text
        });

        this.expenseData = { name: '', category: '', expenditure: null, date: '' };
        this.isSubmitted = false;
        this.modalService.dismissAll();
      },
      error: (error) => console.error('Error:', error)
    });
  }

}


