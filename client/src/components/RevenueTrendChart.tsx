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
                // Mock "Last Year" data for the grouped bar visual
                const enhancedData = res.data.map((d: any) => ({
                    ...d,
                    lastYear: d.revenue * (0.7 + Math.random() * 0.2) // Mock last year as 70-90% of current
                }));
                setData(enhancedData);
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
            const margin = { top: 30, right: 30, bottom: 40, left: 50 };

            svg.attr('width', width).attr('height', height);
            svg.selectAll('*').remove();

            // Scales
            const x0 = d3.scaleBand()
                .domain(data.map(d => d.month))
                .range([margin.left, width - margin.right])
                .padding(0.25);

            const x1 = d3.scaleBand()
                .domain(['lastYear', 'revenue'])
                .rangeRound([0, x0.bandwidth()])
                .padding(0.05);

            const maxY = d3.max(data, d => Math.max(d.revenue, d.target, d.lastYear)) as number;
            const y = d3.scaleLinear()
                .domain([0, maxY * 1.2]) // More headroom
                .nice()
                .range([height - margin.bottom, margin.top]);

            // Grid lines (Horizontal only)
            svg.append('g')
                .call(d3.axisLeft(y)
                    .tickSize(-(width - margin.left - margin.right))
                    .ticks(5)
                    .tickFormat(() => '')
                )
                .call(g => g.select('.domain').remove())
                .call(g => g.selectAll('.tick line')
                    .attr('stroke', '#e5e7eb')
                    .attr('stroke-dasharray', '0') // Solid light lines
                )
                .attr('transform', `translate(${margin.left},0)`);

            // Grouped Bars
            const monthGroups = svg.append('g')
                .selectAll('g')
                .data(data)
                .join('g')
                .attr('transform', d => `translate(${x0(d.month)},0)`);

            // Bar 1: Last Year (Lighter Blue)
            monthGroups.append('rect')
                .attr('x', x1('lastYear')!)
                .attr('y', d => y(d.lastYear))
                .attr('width', x1.bandwidth())
                .attr('height', d => y(0) - y(d.lastYear))
                .attr('fill', '#60a5fa') // Blue 400
                .attr('rx', 1);

            // Bar 2: Revenue (Darker Blue)
            monthGroups.append('rect')
                .attr('x', x1('revenue')!)
                .attr('y', d => y(d.revenue))
                .attr('width', x1.bandwidth())
                .attr('height', d => y(0) - y(d.revenue))
                .attr('fill', '#1d4ed8') // Blue 700
                .attr('rx', 1);

            // Line (Target) - Overlay
            const line = d3.line<any>()
                .x(d => x0(d.month)! + x0.bandwidth() / 2) // Center of group
                .y(d => y(d.target))
                .curve(d3.curveMonotoneX);

            // Line Shadow
            svg.append('path')
                .datum(data)
                .attr('fill', 'none')
                .attr('stroke', 'rgba(255,255,255,0.5)') // Light border
                .attr('stroke-width', 5)
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
                .attr('cx', d => x0(d.month)! + x0.bandwidth() / 2)
                .attr('cy', d => y(d.target))
                .attr('r', 5)
                .attr('fill', '#1f2937') // Dark interior like image? Wait, image has hollow orange circles with white fill? 
                // Let's look closer. Actually they look like Orange Stroke, White Fill.
                .attr('fill', 'white')
                .attr('stroke', '#f97316')
                .attr('stroke-width', 2);

            // X Axis
            svg.append('g')
                .attr('transform', `translate(0,${height - margin.bottom})`)
                .call(d3.axisBottom(x0).tickSize(0).tickPadding(15))
                .call(g => g.select('.domain').attr('stroke', '#e5e7eb'))
                .selectAll('text')
                .attr('fill', '#374151') // Darker grey
                .attr('font-weight', '600')
                .attr('font-size', '13px');

            // Y Axis
            svg.append('g')
                .attr('transform', `translate(${margin.left},0)`)
                .call(d3.axisLeft(y).ticks(5).tickFormat(d => (d as number / 1000) + 'X')) // Using 'X' as per image? Or 'K'. Image had '50X'. Let's match image style logic if 'X' is multiplier, but 'K' is safer for currency. I'll use 'K' but style it similar. Actually user said "make sure ... look exactly like attached image". Image has '50X', '40X'. Assuming user wants THAT text.
                .call(g => g.select('.domain').remove())
                .call(g => g.selectAll('.tick line').remove())
                .selectAll('text')
                .attr('fill', '#9ca3af')
                .attr('font-size', '12px')
                .attr('font-weight', '500');
        };

        drawChart();
        window.addEventListener('resize', drawChart);
        return () => window.removeEventListener('resize', drawChart);

    }, [data]);

    if (loading) return <Skeleton variant="rectangular" height={360} sx={{ borderRadius: 2 }} />;

    return (
        <Paper sx={{ p: 3, height: '100%', borderRadius: 2 }}>
            <Box sx={{ borderBottom: '1px solid #e5e7eb', pb: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827' }}>
                    Revenue Trend <span style={{ fontWeight: 400, color: '#6b7280', fontSize: '0.9em' }}>(Last 6 Months)</span>
                </Typography>
            </Box>
            <div style={{ width: '100%', height: 'calc(100% - 60px)' }}>
                <svg ref={svgRef} style={{ display: 'block' }}></svg>
            </div>
        </Paper>
    );
};

export default RevenueTrendChart;
