import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    ArcElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

// Chart.js üçün lazımlı modulları qeydiyyatdan keçirmək
ChartJS.register(CategoryScale, LinearScale, ArcElement, Title, Tooltip, Legend);

const PieChartComponent = ({ title, labels, dataPoints }) => {
    const data = {
        labels: labels,
        datasets: [
            {
                label: 'Satışlar',
                data: dataPoints,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: title || 'Qrafik',
            },
        },
    };

    return (
        <div className="bg-white p-5 shadow-md rounded-md w-[600px]">
            <Pie data={data} options={options} />
        </div>
    );
};

export default PieChartComponent;