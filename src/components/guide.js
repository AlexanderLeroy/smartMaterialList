import React from 'react';
import { Link } from "react-router-dom";

export function GuideBlock() {
    return (
        <div className="guide-block">
            <span>Для использования умного списка материалов нужно загрузить файлы в формате <span className="guide-highlight">.csv</span>.</span>
            <span>Чтобы получить файлы в этом формате нажмите на кнопку <span className="guide-highlight">Записать в файл</span> в списке материалов с зажатым <span className="guide-highlight">Shift</span>.</span>
            <img className="guide-img" src="guide-1.png"/>
            <span>После этого файл появится в <span className="guide-highlight">config/litematica</span>, его и нужно загрузить на сайт для начала работы. Поддерживаются файлы на русском и английском языках.</span>
            <span>Чтобы произвести рассчёт затрачиваемых ресурсов для крафта, необходимо задать крафты на соответствующей <Link to="/crafts" className="guide-link">странице</Link> или использовать один из шаблонов.</span>
            <span>Когда используемые рецепты крафтов будут заданы, при переключении режима отображения, количество ресурсов из списка материалов будет пересчитано исходя из установленных крафтов.</span>
        </div>
    )
}