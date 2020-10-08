package com.quanyou.qup.demo.service;

import com.quanyou.qup.query.DefaultService;
import com.quanyou.qup.demo.entity.Demo;
import com.quanyou.qup.demo.mapper.DemoMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Demo
 *
 * @author 抓抓匠
 * @since 2020-06-10
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DemoService extends DefaultService<DemoMapper, Demo> {
}