import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  submitted = false;

  expenseData = {
    expenditure: '',
    name: '',
    date: '',
    category: ''
  };
  expensiveList = [];
  constructor(private fb: FormBuilder, private modalService: NgbModal,private expenseService: ExpensesService) {
   }
  isSidebarExpanded = false;
  switchScreen: number = 1;
  chartOptions: echarts.EChartsOption;
  ngOnInit(): void {
    this.getExpenses();
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

  }

  onClickMonth(){

  }

  addExpensive(content) {
    this.modalService.open(this.content, { centered: true, size: 'md' });
  }

  onClickLogout(){
    
  }

  getExpenses(){
    this.expenseService.getAllExpenses().subscribe((res) => {
      this.expensiveList = res;
      this.prepareHomePage();
    });
  }

  onSubmit() {
    this.expenseService.addExpense(this.expenseData).subscribe({
      next: () => {
        Swal.fire({
					title: `Success`,
					text:`Expense added successfully`,
					icon: 'success',
					confirmButtonText:`OK!`,
					allowOutsideClick: false
				});
        this.modalService.dismissAll();
      },
      error: (error) => console.error('Error:', error)
    });
  }
}


