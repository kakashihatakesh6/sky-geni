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

        const svg = d3.select(svgRef.current);
        const parent = svgRef.current.parentElement;
        const width = parent?.clientWidth || 600;
        const height = 300;
        const margin = { top: 30, right: 30, bottom: 40, left: 50 };

        svg.attr('width', width).attr('height', height);
        svg.selectAll('*').remove(); // Clear previous

        const x = d3.scaleBand()
            .domain(data.map(d => d.month))
            .range([margin.left, width - margin.right])
            .padding(0.4); // Thinner bars

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => Math.max(d.revenue, d.target)) as number * 1.2]) // More headroom
            .nice()
            .range([height - margin.bottom, margin.top]);

        // Grid lines
        svg.append('g')
            .call(d3.axisLeft(y)
                .tickSize(-(width - margin.left - margin.right))
                .ticks(5)
                .tickFormat(() => '') // No labels on grid lines
            )
            .call(g => g.select('.domain').remove())
            .call(g => g.selectAll('.tick line')
                .attr('stroke', '#e5e7eb')
                .attr('stroke-dasharray', '4,4') // Dashed grid
            )
            .attr('transform', `translate(${margin.left},0)`);

        // Bars (Revenue)
        svg.append('g')
            .attr('fill', '#2563eb') // Bright Blue
            .selectAll('rect')
            .data(data)
            .join('rect')
            .attr('x', d => x(d.month)!)
            .attr('y', d => y(d.revenue))
            .attr('height', d => y(0) - y(d.revenue))
            .attr('width', x.bandwidth())
            .attr('rx', 2);

        // Line (Target)
        const line = d3.line<any>()
            .x(d => x(d.month)! + x.bandwidth() / 2)
            .y(d => y(d.target))
            .curve(d3.curveMonotoneX); // Smooth curve

        svg.append('path')
            .datum(data)
            .attr('fill', 'none')
            .attr('stroke', '#f97316') // Orange
            .attr('stroke-width', 3)
            .attr('d', line);

        // Dots for Line
        svg.append('g')
            .selectAll('circle')
            .data(data)
            .join('circle')
            .attr('cx', d => x(d.month)! + x.bandwidth() / 2)
            .attr('cy', d => y(d.target))
            .attr('r', 5)
            .attr('fill', 'white')
            .attr('stroke', '#f97316')
            .attr('stroke-width', 2);

        // Axis Labels
        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(x).tickSize(0).tickPadding(15))
            .call(g => g.select('.domain').attr('stroke', '#e5e7eb'))
            .selectAll('text')
            .attr('fill', '#6b7280')
            .attr('font-weight', '500');

        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(d3.axisLeft(y).ticks(5).tickFormat(d => (d as number / 1000) + 'k'))
            .call(g => g.select('.domain').remove())
            .call(g => g.selectAll('.tick line').remove()) // Remove tick lines here, handled by grid
            .selectAll('text')
            .attr('fill', '#9ca3af') // Lighter axis text
            .attr('font-size', '11px');

    }, [data]);

    if (loading) return <Skeleton variant="rectangular" height={360} sx={{ borderRadius: 2 }} />;

    return (
        <Paper sx={{ p: 4, height: '100%', borderRadius: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Revenue Trend (Last 6 Months)</Typography>
            <div style={{ width: '100%' }}>
                <svg ref={svgRef}></svg>
            </div>
        </Paper>
    );
};

export default RevenueTrendChart;
