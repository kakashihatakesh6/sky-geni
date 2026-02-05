import React, { useEffect, useRef, useState } from 'react';
import { Paper, Typography, Box, Skeleton } from '@mui/material';
import * as d3 from 'd3';
import axios from 'axios';

const RevenueTrendChart = () => {
    const svgRef = useRef<SVGSVGElement>(null);
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get('http://localhost:3000/api/trend')
            .then(res => {
                setData(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (!data.length || !svgRef.current) return;

        const drawChart = () => {
            const svg = d3.select(svgRef.current);
            const parent = svgRef.current?.parentElement;
            if (!parent) return;

            const width = parent.clientWidth || 600;
            const height = parent.clientHeight || 300;
            const margin = { top: 20, right: 30, bottom: 40, left: 50 };

            svg.attr('width', width).attr('height', height);
            svg.selectAll('*').remove();

            // Gradient definition
            const defs = svg.append("defs");
            const gradient = defs.append("linearGradient")
                .attr("id", "barGradient")
                .attr("x1", "0%")
                .attr("y1", "0%")
                .attr("x2", "0%")
                .attr("y2", "100%");
            gradient.append("stop")
                .attr("offset", "0%")
                .attr("stop-color", "#3b82f6"); // Blue 500
            gradient.append("stop")
                .attr("offset", "100%")
                .attr("stop-color", "#1d4ed8"); // Blue 700

            const x = d3.scaleBand()
                .domain(data.map(d => d.month))
                .range([margin.left, width - margin.right])
                .padding(0.3);

            const y = d3.scaleLinear()
                .domain([0, d3.max(data, d => Math.max(d.revenue, d.target)) as number * 1.1])
                .nice()
                .range([height - margin.bottom, margin.top]);

            // Grid lines
            svg.append('g')
                .call(d3.axisLeft(y)
                    .tickSize(-(width - margin.left - margin.right))
                    .ticks(5)
                    .tickFormat(() => '')
                )
                .call(g => g.select('.domain').remove())
                .call(g => g.selectAll('.tick line')
                    .attr('stroke', '#f3f4f6')
                    .attr('stroke-dasharray', '0')
                )
                .attr('transform', `translate(${margin.left},0)`);

            // Bars (Revenue) with Gradient
            svg.append('g')
                .attr('fill', 'url(#barGradient)')
                .selectAll('rect')
                .data(data)
                .join('rect')
                .attr('x', d => x(d.month)!)
                .attr('y', d => y(d.revenue))
                .attr('height', d => y(0) - y(d.revenue))
                .attr('width', x.bandwidth())
                .attr('rx', 4);

            // Line (Target)
            const line = d3.line<any>()
                .x(d => x(d.month)! + x.bandwidth() / 2)
                .y(d => y(d.target))
                .curve(d3.curveMonotoneX);

            // Shadow for line
            svg.append('path')
                .datum(data)
                .attr('fill', 'none')
                .attr('stroke', 'rgba(249, 115, 22, 0.2)')
                .attr('stroke-width', 8)
                .attr('d', line);

            svg.append('path')
                .datum(data)
                .attr('fill', 'none')
                .attr('stroke', '#f97316')
                .attr('stroke-width', 3)
                .attr('d', line);

            // Dots
            svg.append('g')
                .selectAll('circle')
                .data(data)
                .join('circle')
                .attr('cx', d => x(d.month)! + x.bandwidth() / 2)
                .attr('cy', d => y(d.target))
                .attr('r', 6)
                .attr('fill', 'white')
                .attr('stroke', '#f97316')
                .attr('stroke-width', 2);

            // Axis
            svg.append('g')
                .attr('transform', `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x).tickSize(0).tickPadding(12))
                .call(g => g.select('.domain').remove())
                .selectAll('text')
                .attr('fill', '#6b7280')
                .attr('font-weight', '600')
                .attr('font-size', '12px');

            svg.append('g')
                .attr('transform', `translate(${margin.left},0)`)
                .call(d3.axisLeft(y).ticks(5).tickFormat(d => (d as number / 1000) + 'k'))
                .call(g => g.select('.domain').remove())
                .call(g => g.selectAll('.tick line').remove())
                .selectAll('text')
                .attr('fill', '#9ca3af')
                .attr('font-size', '12px');
        };

        drawChart();
        window.addEventListener('resize', drawChart);
        return () => window.removeEventListener('resize', drawChart);

    }, [data]);

    if (loading) return <Skeleton variant="rectangular" height={360} sx={{ borderRadius: 2 }} />;

    return (
        <Paper sx={{ p: 4, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Revenue Trend (Last 6 Months)</Typography>
            <div style={{ width: '100%', height: 'calc(100% - 40px)' }}> {/* Subtract title height approx */}
                <svg ref={svgRef} style={{ display: 'block' }}></svg>
            </div>
        </Paper>
    );
};

export default RevenueTrendChart;
