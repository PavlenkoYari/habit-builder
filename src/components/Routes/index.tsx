import React from 'react';
import {Routes, Route} from "react-router";
import HomePage from '../../page/Home';
import CreateHabit from '../../page/CreateHabit';
import Habit from '../../page/Habit';
import HabitComplete from '../../page/HabitComplete';

export default function RoutesWrapper() {
    return (
        <Routes>
            <Route path={"/"} element={<HomePage />} />
            <Route path={"/habit-create"} element={<CreateHabit />} />
            <Route path={"/habit"} element={<Habit />} />
            <Route path={"/habit-complete"} element={<HabitComplete />} />
        </Routes>
    );
}
