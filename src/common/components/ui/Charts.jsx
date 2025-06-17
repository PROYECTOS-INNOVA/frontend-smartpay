import { ResponsivePie } from '@nivo/pie';
import { ResponsiveBar } from '@nivo/bar';


const nivoTheme = {
    tooltip: {
        container: {
            background: '#ffffff',
            color: '#374151',
            fontSize: '12px',
            borderRadius: '4px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        },
    },
    labels: {
        text: {
            fill: '#ffffff',
            fontSize: 11,
            fontWeight: 'bold',
        }
    },
    axis: {
        ticks: { text: { fontSize: 10, fill: '#6b7280' } },
        legend: { text: { fontSize: 12, fill: '#374151', fontWeight: 'medium' } },
    },
    legends: {
        text: { fontSize: 11, fill: '#374151' }
    }
};


const defaultPieDataExample = [
    { id: 'Ejemplo A', label: 'Ejemplo A', value: 60, color: '#34D399' },
    { id: 'Ejemplo B', label: 'Ejemplo B', value: 40, color: '#F87171' },
];

const defaultBarDataExample = [
    { category: 'Cat 1', val1: 20, val2: 10 },
    { category: 'Cat 2', val1: 15, val2: 25 },
];

export const PieChart = ({ data = defaultPieDataExample, title, subTitle }) => {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200 h-72 sm:h-80 flex items-center justify-center">
                <p className="text-gray-500">No hay datos para el gráfico circular.</p>
            </div>
        );
    }
    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{title || 'Gráfico Circular'}</h3>
            {subTitle && <p className="text-xs text-gray-500 mb-3">{subTitle}</p>}
            <div className="h-72 sm:h-80">
                <ResponsivePie
                    data={data}
                    theme={nivoTheme}
                    // Márgenes ajustados para Pie Chart
                    margin={{ top: 20, right: 20, bottom: 20, left: 20 }} // Reducidos
                    innerRadius={0.5}
                    padAngle={0.7}
                    cornerRadius={3}
                    activeOuterRadiusOffset={8}
                    colors={datum => datum.data.color || '#cccccc'}
                    borderWidth={1}
                    borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                    arcLinkLabelsSkipAngle={10}
                    arcLinkLabelsTextColor="#374151"
                    arcLinkLabelsThickness={2}
                    arcLinkLabelsColor={{ from: 'color' }}
                    arcLabelsSkipAngle={10}
                    enableArcLabels={true}
                    legends={[
                        {
                            anchor: 'bottom',
                            direction: 'row',
                            justify: false,
                            translateX: 0,
                            translateY: 56, // Puede que necesites ajustar esto si la leyenda se superpone
                            itemsSpacing: 0,
                            itemWidth: 100,
                            itemHeight: 18,
                            itemDirection: 'left-to-right',
                            itemOpacity: 1,
                            symbolSize: 14,
                            symbolShape: 'circle',
                            effects: [{ on: 'hover', style: { itemTextColor: '#000000' } }],
                        },
                    ]}
                />
            </div>
        </div>
    );
};

export const BarChart = ({ data = defaultBarDataExample, title, subTitle, keys = ['val1', 'val2'], indexBy = 'category', groupMode = 'grouped', layout = 'vertical', barColorsMap, customOptions = {} }) => {
    if (!data || data.length === 0) {
        return (
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200 h-72 sm:h-80 flex items-center justify-center">
                <p className="text-gray-500">No hay datos para el gráfico de barras.</p>
            </div>
        );
    }

    const axisLeftConfig = layout === 'horizontal' ? {
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: indexBy.charAt(0).toUpperCase() + indexBy.slice(1),
        legendPosition: 'middle',
        legendOffset: -50, // Ligeramente ajustado
    } : {
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Valor',
        legendPosition: 'middle',
        legendOffset: -50, // Ligeramente ajustado
    };

    const axisBottomConfig = layout === 'horizontal' ? {
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: 'Valor',
        legendPosition: 'middle',
        legendOffset: 32, // Ligeramente ajustado
    } : {
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: indexBy.charAt(0).toUpperCase() + indexBy.slice(1),
        legendPosition: 'middle',
        legendOffset: 32, // Ligeramente ajustado
    };


    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{title || 'Gráfico de Barras'}</h3>
            {subTitle && <p className="text-xs text-gray-500 mb-3">{subTitle}</p>}
            <div className="h-72 sm:h-80">
                <ResponsiveBar
                    data={data}
                    keys={keys}
                    indexBy={indexBy}
                    theme={nivoTheme}
                    // Márgenes ajustados para Bar Chart
                    margin={{ top: 30, right: layout === 'horizontal' ? 60 : (keys.length > 1 ? 110 : 40), bottom: 60, left: 60 }} // Reducidos
                    padding={0.3}
                    groupMode={groupMode}
                    layout={layout}
                    valueScale={{ type: 'linear' }}
                    indexScale={{ type: 'band', round: true }}
                    colors={barColorsMap ? (bar => barColorsMap[bar.id] || '#cccccc') : { scheme: 'nivo' }}
                    borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                    axisTop={null}
                    axisRight={null}
                    axisBottom={axisBottomConfig}
                    axisLeft={axisLeftConfig}
                    enableLabel={true}
                    legends={keys.length > 1 ? [
                        {
                            dataFrom: 'keys',
                            anchor: layout === 'vertical' ? 'top-right' : 'bottom-right',
                            direction: 'column',
                            justify: false,
                            translateX: layout === 'vertical' ? 120 : 0,
                            translateY: layout === 'vertical' ? 0 : 70,
                            itemsSpacing: 2,
                            itemWidth: 100,
                            itemHeight: 20,
                            itemDirection: 'left-to-right',
                            itemOpacity: 0.85,
                            symbolSize: 14,
                            symbolShape: 'circle',
                            effects: [{ on: 'hover', style: { itemOpacity: 1 } }],
                        },
                    ] : []}
                    animate={true}
                    motionConfig="gentle"
                    {...customOptions}
                />
            </div>
        </div>
    );
};