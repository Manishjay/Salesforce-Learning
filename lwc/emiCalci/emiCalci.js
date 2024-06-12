import { LightningElement } from 'lwc';
import { loadScript } from 'lightning/platformResourceLoader';
import chartjs from '@salesforce/resourceUrl/ChartJS';

export default class EmiCalculator extends LightningElement {
    loanAmount = 3550000;
    interestRate = 8.3;
    loanTenure = 12;
    emi;
    totalInterest;
    totalAmount;
    chart;

    chartjsInitialized = false;

    connectedCallback() {
        if (this.chartjsInitialized) {
            return;
        }
        this.chartjsInitialized = true;

        loadScript(this, chartjs)
            .then(() => {
                this.calculateEmi();
                this.renderChart();
            })
            .catch(error => {
                console.error('Error loading Chart.js', error);
            });
    }

    handleLoanAmountChange(event) {
        this.loanAmount = event.target.value;
        this.calculateEmi();
        this.updateChart();
    }

    handleInterestRateChange(event) {
        this.interestRate = event.target.value;
        this.calculateEmi();
        this.updateChart();
    }

    handleLoanTenureChange(event) {
        this.loanTenure = event.target.value;
        this.calculateEmi();
        this.updateChart();
    }

    calculateEmi() {
        const principal = this.loanAmount;
        const annualInterest = this.interestRate / 100;
        const monthlyInterest = annualInterest / 12;
        const numberOfPayments = this.loanTenure * 12;

        const emi = (principal * monthlyInterest * Math.pow(1 + monthlyInterest, numberOfPayments)) / (Math.pow(1 + monthlyInterest, numberOfPayments) - 1);
        this.emi = emi.toFixed(0);

        this.totalAmount = (emi * numberOfPayments).toFixed(0);
        this.totalInterest = (this.totalAmount - principal).toFixed(0);
    }

    renderChart() {
        const ctx = this.template.querySelector('canvas.chart').getContext('2d');
        this.chart = new window.Chart(ctx, {
            type: 'pie',
            data: {
                labels: ['Principal amount', 'Interest amount'],
                datasets: [{
                    label: 'Amount',
                    data: [this.loanAmount, this.totalInterest],
                    backgroundColor: ['#76c7c0', '#4e73df']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top'
                    }
                }
            }
        });
    }

    updateChart() {
        if (this.chart) {
            this.chart.data.datasets[0].data = [this.loanAmount, this.totalInterest];
            this.chart.update();
        }
    }
}
