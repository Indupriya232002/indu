import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExpensesService } from 'src/app/services/expenses.service';

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

  constructor(private fb: FormBuilder, private modalService: NgbModal,private expenseService: ExpensesService) {
   }
  isSidebarExpanded = false;
  switchScreen: number = 1;
  chartOptions: echarts.EChartsOption;
  ngOnInit(): void {
  }

  onClickHome() {
    this.switchScreen = 1;
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
          data: [
            { value: 1048, name: 'Search Engine' },
            { value: 735, name: 'Direct' },
            { value: 580, name: 'Email' },
            { value: 484, name: 'Union Ads' },
            { value: 300, name: 'Video Ads' }
          ]
        }
      ]
    };
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

  onSubmit() {
    this.expenseService.addExpense(this.expenseData).subscribe({
      next: () => {
        console.log('Expense Saved');
        this.modalService.dismissAll();
      },
      error: (error) => console.error('Error:', error)
    });
  }
}


